"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface data{
    URL1: string,
    URL2: string,
    name1: string,
    name2: string,
    img: string,
    type: string

}

export default function Home() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [data, setData] = useState<data[]>([])
  const [loading, setLoading] = useState(false)
  const [URL1, setURL1] = useState("");
  const [URL2, setURL2] = useState("");
  const [category, setCategory] = useState("");

  const [fetchedName, setfetchedName] = useState("")
  const [fetchedURL1, setfetchedURL1] = useState("")
  const [fetchedURL2, setfetchedURL2] = useState("")
  const [fetchedPrice1, setfetchedPrice1] = useState("")
  const [fetchedPrice2, setfetchedPrice2] = useState("")
  const [fetchedImage, setfetchedImage] = useState("")

  const [fetchloading, setFetchLoading] = useState(false)

  useEffect( () => {
    ( async () => {
      setLoading(true)
      const response: any = await axios.get('http://127.0.0.1:5000/getProducts')
      setData(response.data)
      setLoading(false)
    })()

  }, [])

  const getProducts = async () => {
    if(name){
      setLoading(true)
      setData([])
      const response: any = await axios.get('http://127.0.0.1:5000/getProducts/'+name)
      setData(response.data)
      setLoading(false) 
    } else {
      setLoading(true)
      setData([])
      const response: any = await axios.get('http://127.0.0.1:5000/getProducts')
      setData(response.data)
      setLoading(false)
    }
  }

  const addToDatabase = async () => {
    if((URL1 != "") && (URL2 != "") && (category != "")){
      const response = await axios.post("http://127.0.0.1:5000/addToDatabase", {
        URL1,
        URL2,
        category     
      })
    }
  }

  const getDetails = async (url1: string, url2: string) => {
    setFetchLoading(true);
    const response = await axios.post("http://127.0.0.1:5000/getDetails", {
      url1,
      url2     
    })
    setfetchedName(response.data[1])
    setfetchedPrice1(response.data[0])
    setfetchedPrice2(response.data[2])
    setfetchedImage(response.data[3])
    setfetchedURL1(response.data[4])
    setfetchedURL2(response.data[5])
    setFetchLoading(false);

  }

  return (
    <div className="flex">
      <div className="h-screen w-full border border-black">
        <div className="p-3 flex justify-center">
            <input type="text" className="bg-transparent border border-black" value={name} onChange={(e) => setName(e.target.value)}/>
            <button className="" onClick={getProducts}>
              Search
            </button>
        </div>
        <div className="border-black border m-4 p-6 h-5/6 overflow-y-auto">
          
          {
            loading &&
            <div>
              Loading ...
            </div>
          }

          {
            data.map((element, index) => {
              return <div className="flex justify-center items-center m-3 p-2 h-1/4 border border-black hover:bg-slate-500 transition-all duration-150 cursor-pointer" key={index} onClick={() => getDetails(element.URL1, element.URL2)}>
                <div className="flex justify-center items-center w-1/3 p-1">
                  <img className="w-1/2" src={element.img} alt="No image" />
                </div>
                <div className="flex justify-center items-center w-2/3 p-1">
                  {element.name1}
                </div>
              </div>
            })
          }
          {
            data.length !== 0 && 
          <div className="text-center">
              <div className="flex justify-center items-center">
                <div className="border border-black w-1/2 mt-10 p-5">
                  Want to add something ?
                  <div className="p-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Add</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Provide the details</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="flex m-1">
                              <div className="p-1">
                                URL1
                              </div>
                              <input type="text" className="border border-black" value={URL1} onChange={(e) => setURL1(e.target.value)}/>
                            </div>
                            <div className="flex m-1">
                              <div className="p-1">
                                URL2
                              </div>
                              <input type="text" className="border border-black" value={URL2} onChange={(e) => setURL2(e.target.value)}/>
                            </div>
                            <div className="flex">
                              <div className="p-1">
                                Category
                              </div>
                              <input type="text" className="border border-black" value={category} onChange={(e) => setCategory(e.target.value)}/>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction onClick={addToDatabase}>Add</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          }


          {
            !data.length && !loading &&
            <div className="text-center">
              <div>
                No item found
              </div>
              <div className="flex justify-center items-center">
                <div className="border border-black w-1/2 mt-10 p-5">
                  Want to add something ?
                  <div className="p-3">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Add</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Provide the details</AlertDialogTitle>
                          <AlertDialogDescription>
                            <div className="flex m-1">
                              <div className="p-1">
                                URL1
                              </div>
                              <input type="text" className="border border-black" value={URL1} onChange={(e) => setURL1(e.target.value)}/>
                            </div>
                            <div className="flex m-1">
                              <div className="p-1">
                                URL2
                              </div>
                              <input type="text" className="border border-black" value={URL2} onChange={(e) => setURL2(e.target.value)}/>
                            </div>
                            <div className="flex">
                              <div className="p-1">
                                Category
                              </div>
                              <input type="text" className="border border-black" value={category} onChange={(e) => setCategory(e.target.value)}/>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction onClick={addToDatabase}>Add</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      { 
        !fetchloading && 
        <div className="h-screen w-full border border-black">
                  
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

          <img
            src={fetchedImage}
          />

          {/* Product Name */}
          <h1 className="text-2xl text-center font-bold mt-6">{fetchedName}</h1>

          {/* Price Comparisons */}
          <div className="mt-6 space-y-4 w-full max-w-sm">
            
              <div
                className="flex flex-col items-center border p-4 rounded-lg shadow-md bg-white hover:bg-slate-300 active:bg-slate-500 cursor-pointer"
                onClick={ () => {
                  if(fetchedURL1){
                    window.open(fetchedURL1, "_blank", "noopener,noreferrer")
                  }
                } }
              >
                
                <p className="text-gray-700 text-sm my-2">Flipkart - {fetchedPrice1}</p>
                
              </div>

              <div
                className="flex flex-col items-center border p-4 rounded-lg shadow-md bg-white hover:bg-slate-300 active:bg-slate-500 cursor-pointer"
                onClick={ () => {
                  if(fetchedURL2){
                    window.open(fetchedURL2, "_blank", "noopener,noreferrer")
                  }
                } }
              > 
                <p className="text-gray-700 text-sm my-2">Croma - {fetchedPrice2}</p>
                
              </div>
            
          </div>
        </div>

        </div>
      }

      {
        fetchloading && <div className="text-center h-screen w-full border border-black">
          Fetching Data ...
        </div>
      }
      
    </div>
  );
}
