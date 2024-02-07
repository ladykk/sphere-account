import { useForm } from "react-hook-form"
import Image from "next/image"
import { Button } from "@/components/ui/button";


export default function product() {

  // const { register } = useForm()

  return (
    <>
      <h1> Product Detail</h1>
      <div>
        <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Product Number </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-product-number" type="text"></input>
              {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Barcode </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-barcode" type="text" ></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Product Type </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-product-type" type="text"></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Selling_Price </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-selling-price" type="text" ></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Product Name </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-product-name" type="text" ></input>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Vat </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-vat" type="text"></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Product Code </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-product-code" type="text" ></input>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Description </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-description" type="text"></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Category </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-category" type="text" ></input>
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Quantity </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-quantity" type="text"></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Unit </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-unit" type="text" ></input>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Income Account </label>
              <input className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500" id="grid-income-account" type="text" ></input>
            </div>

            <div className="w-full md:w-1/2 px-3">
              <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2"> Product Picture </label>
              <div className="appearance-none block w-full text-gray-700 border rounded py-3 px-4 mb-3 leading-tight border-gray-500">
                <Image src="/public/static/img-upload.png" width={30} height={30} alt="img-upload" ></Image>
              </div>
            </div>

            <div>
              <br />
              <Button className="text-white font-bold py-2 px-4 rounded-10">Cancel</Button>
              <Button className="bg-blue-500 text-white font-bold py-2 px-4 rounded-10 ml-4">Save</Button>
            </div>

          </div>
        </form>
      </div>

    </>
  )

}

