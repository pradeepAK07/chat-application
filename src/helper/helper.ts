import { pathConstraints } from "../routes/pathConfig";

interface navMenusType {
  label: string;
  path: string;
}

export const navMenus: navMenusType[] = [
  {
    label: "Home",
    path: pathConstraints.HOME
  },
  {
    label: "add role",
    path: pathConstraints.ADD_ROLE
  },
  {
    label: "chat",
    path: pathConstraints.CHAT
  }
];

export const userRoles = [
  { label: "admin", value: "ADMIN" },
  { label: "super admin", value: "SUPER_ADMIN" }
];

export const handleConversationId = (
  senderUserId: string,
  recipientUserId: string
) => {
  const ConversationId = senderUserId?.concat(recipientUserId);
  return ConversationId;
};
