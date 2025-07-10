import { Member, Profile, Server } from "@prisma/client";
import { Server as Netserver, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiServerResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: Netserver & {
      io: SocketIOServer;
    };
  };
};