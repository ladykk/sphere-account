import { z } from "zod";

export const vatServiceInputSchema = z.string();

export const vatServiceOutputSchema = z.object({
  NID: z.string().default(""),
  TIN: z.string().default(""),
  TitleName: z.string().default(""),
  Name: z.string().default(""),
  Surname: z.string().default(""),
  BranchTitleName: z.string().default(""),
  BranchName: z.string().default(""),
  BranchNumber: z.number().default(0),
  BuildingName: z.string().default(""),
  FloorNumber: z.string().default(""),
  VillageName: z.string().default(""),
  RoomNumber: z.string().default(""),
  HouseNumber: z.string().default(""),
  MooNumber: z.string().default(""),
  SoiName: z.string().default(""),
  StreetName: z.string().default(""),
  Thambol: z.string().default(""),
  Amphur: z.string().default(""),
  Province: z.string().default(""),
  PostCode: z.string().default(""),
  BusinessFirstDate: z.string().default(""),
  Yaek: z.string().default(""),
});

const VatService = {
  schema: {
    vatServiceInputSchema,
    vatServiceOutputSchema,
  },
};

export default VatService;
