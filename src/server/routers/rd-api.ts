import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import VatService from "../models/rd-api";

export const rdAPIRouter = createTRPCRouter({
  getVatService: protectedProcedure
    .input(VatService.schema.vatServiceInputSchema)
    .output(VatService.schema.vatServiceOutputSchema)
    .mutation(async ({ input }) => {
      return await fetch("https://rdws.rd.go.th/jsonRD/vatserviceRD3.asmx", {
        method: "POST",
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: "https://rdws.rd.go.th/JserviceRD3/vatserviceRD3/Service",
        },
        body: `<?xml version="1.0" encoding="utf-8"?>
              <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                <soap:Body>
                  <Service xmlns="https://rdws.rd.go.th/JserviceRD3/vatserviceRD3">
                    <username>anonymous</username>
                    <password>anonymous</password>
                    <TIN>${input}</TIN>
                  </Service>
                </soap:Body>
              </soap:Envelope>`,
      }).then(async (res) => {
        const raw = await res.text();
        const object = JSON.parse(
          raw
            .split(`<ServiceResult xsi:type="xsd:string">`)[1]
            .split(`</ServiceResult>`)[0]
        ) as {
          NID: string[];
          TIN: string[];
          TitleName: string[];
          Name: string[];
          Surname: string[];
          BranchTitleName: string[];
          BranchName: string[];
          BranchNumber: number[];
          BuildingName: string[];
          FloorNumber: string[];
          VillageName: string[];
          RoomNumber: string[];
          HouseNumber: string[];
          MooNumber: string[];
          SoiName: string[];
          StreetName: string[];
          Thambol: string[];
          Amphur: string[];
          Province: string[];
          PostCode: string[];
          BusinessFirstDate: string[];
          Yaek: string[];
          msgerr: string[];
        };

        if (!object) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        if (object.msgerr[0]) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: object.msgerr[0],
          });
        }

        return {
          NID: object.NID[0] === "-" ? "" : object.NID[0],
          TIN: object.TIN[0] === "-" ? "" : object.TIN[0],
          TitleName: object.TitleName[0] === "-" ? "" : object.TitleName[0],
          Name: object.Name[0] === "-" ? "" : object.Name[0],
          Surname: object.Surname[0] === "-" ? "" : object.Surname[0],
          BranchTitleName:
            object.BranchTitleName[0] === "-" ? "" : object.BranchTitleName[0],
          BranchName: object.BranchName[0] === "-" ? "" : object.BranchName[0],
          BranchNumber: object.BranchNumber[0],
          BuildingName:
            object.BuildingName[0] === "-" ? "" : object.BuildingName[0],
          FloorNumber:
            object.FloorNumber[0] === "-" ? "" : object.FloorNumber[0],
          VillageName:
            object.VillageName[0] === "-" ? "" : object.VillageName[0],
          RoomNumber: object.RoomNumber[0] === "-" ? "" : object.RoomNumber[0],
          HouseNumber:
            object.HouseNumber[0] === "-" ? "" : object.HouseNumber[0],
          MooNumber: object.MooNumber[0] === "-" ? "" : object.MooNumber[0],
          SoiName: object.SoiName[0] === "-" ? "" : object.SoiName[0],
          StreetName: object.StreetName[0] === "-" ? "" : object.StreetName[0],
          Thambol: object.Thambol[0] === "-" ? "" : object.Thambol[0],
          Amphur: object.Amphur[0] === "-" ? "" : object.Amphur[0],
          Province: object.Province[0] === "-" ? "" : object.Province[0],
          PostCode: object.PostCode[0] === "-" ? "" : object.PostCode[0],
          BusinessFirstDate:
            object.BusinessFirstDate[0] === "-"
              ? ""
              : object.BusinessFirstDate[0],
          Yaek: object.Yaek[0] === "-" ? "" : object.Yaek[0],
        } satisfies z.infer<typeof VatService.schema.vatServiceOutputSchema>;
      });
    }),
});
