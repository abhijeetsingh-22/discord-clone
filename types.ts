import { Server,Member,Profile } from "@prisma/client";

export type ServerWithMembersAndProfiles=Server &{
  members: (Member & { profile:Profile})[]

}