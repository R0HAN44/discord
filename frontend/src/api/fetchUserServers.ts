import { toast } from "@/hooks/use-toast"
import { getUserServers } from "./apiController";
import useAppStore from "@/useAppStore";

export default async function fetchUserServers(userid : string){
  const {setServers} = useAppStore();
  try {
    console.log("user id....",userid)
    const response = await getUserServers(userid);
    setServers(response?.servers || []);
  } catch (error) {
    console.log(error) 
    toast({
      variant:'destructive',
      title: "Something went wrong while fetching servers"
    })
  }
}