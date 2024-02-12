import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TrashRed from "@/assets/icon/Trash-Red.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";

export function AttachmentTable() {
  return (
    <div>
      <Tabs className=" mt-7" defaultValue="all">
        <TabsList className=" bg-transparent mb-5">
          <TabsTrigger
            value="all"
            className=" data-[state=active]:shadow-none  data-[state=active]:border-b-orange-500 data-[state=active]:border-b-2 rounded-none w-28"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="customer"
            className=" data-[state=active]:shadow-none  data-[state=active]:border-b-orange-500 data-[state=active]:border-b-2 rounded-none w-28"
          >
            Customer
          </TabsTrigger>
          <TabsTrigger
            value="business"
            className=" data-[state=active]:shadow-none  data-[state=active]:border-b-orange-500 data-[state=active]:border-b-2 rounded-none w-28"
          >
            Business
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>File name</TableHead>
                <TableHead>Upload by</TableHead>
                <TableHead className=" w-1/5">Upload Date</TableHead>
                <TableHead className=" w-1/7"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className=" border rounded-lg">
              <TableRow>
                {" "}
                <TableCell>1</TableCell>
                <TableCell>
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual ...
                </TableCell>
                <TableCell>Miss XXXXXX X.</TableCell>
                <TableCell>2024/02/07</TableCell>
                <TableCell className="flex justify-center">
                  <Image src={TrashRed} alt="Trash" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination className="mt-5 flex justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
        <TabsContent value="customer">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>File name</TableHead>
                <TableHead>Upload by</TableHead>
                <TableHead className=" w-1/5">Upload Date</TableHead>
                <TableHead className=" w-1/7"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className=" border rounded-lg">
              <TableRow>
                {" "}
                <TableCell>1</TableCell>
                <TableCell>
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual ...
                </TableCell>
                <TableCell>Miss XXXXXX X.</TableCell>
                <TableCell>2024/02/07</TableCell>
                <TableCell className="flex justify-center">
                  <Image src={TrashRed} alt="Trash" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination className="mt-5 flex justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
        <TabsContent value="business">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>File name</TableHead>
                <TableHead>Upload by</TableHead>
                <TableHead className=" w-1/5">Upload Date</TableHead>
                <TableHead className=" w-1/7"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className=" border rounded-lg">
              <TableRow>
                {" "}
                <TableCell>1</TableCell>
                <TableCell>
                  Lorem ipsum is a placeholder text commonly used to demonstrate
                  the visual ...
                </TableCell>
                <TableCell>Miss XXXXXX X.</TableCell>
                <TableCell>2024/02/07</TableCell>
                <TableCell className="flex justify-center">
                  <Image src={TrashRed} alt="Trash" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Pagination className="mt-5 flex justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </TabsContent>
      </Tabs>
    </div>
  );
}
