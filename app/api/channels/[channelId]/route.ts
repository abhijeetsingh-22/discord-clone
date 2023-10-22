import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req:Request,
  {params}:{params:{channelId:string}}
  ){

  try {
    const profile=await currentProfile();
    // const {channelId}= await req.json()
    const {searchParams}=new URL(req.url)
    const serverId=searchParams.get("serverId")
    if(!profile)
      return new NextResponse("Unauthorized",{status:401})

    if(!serverId)
      return new NextResponse("server ID missing",{status:500})

    const server= await db.server.update({
      where:{
        id:serverId,
        members:{
          some:{
            profileId: profile.id,
            role:{
              in: [MemberRole.ADMIN,MemberRole.MODERATOR]
            }
          }
        }
      },
      data:{
        channels:{
          delete:{
            id: params.channelId,
            name:{
              not:"general"
            }

          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("CHANNEL_ID_DELETE ", error)
  }
}
export async function PATCH(
  req:Request,
  {params}:{params:{channelId:string}}
  ){

  try {
    const profile=await currentProfile();
    // const {channelId}= await req.json()
    const {searchParams}=new URL(req.url)
    const{name,type}=await req.json()
    const serverId=searchParams.get("serverId")
    if(!profile)
      return new NextResponse("Unauthorized",{status:401})

    if(!serverId)
      return new NextResponse("server ID missing",{status:500})
    if(name==="general"){
      return new NextResponse("Name cannot be 'general' ",{status:400})
    }
    const server= await db.server.update({
      where:{
        id:serverId,
        members:{
          some:{
            profileId: profile.id,
            role:{
              in: [MemberRole.ADMIN,MemberRole.MODERATOR]
            }
          }
        }
      },
      data:{
        channels:{
          update:{
           where:{
            id: params.channelId,
            name:{
              not: "general"
            }
           },
            data:{
              name,
              type
            }
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log("CHANNEL_ID_PATCH ", error)
  }
}