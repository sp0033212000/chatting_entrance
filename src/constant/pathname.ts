export const pathname = {
  auth: "/auth",
  loading: "/loading",

  landingPage: "/",
  room: function (conversationId: string) {
    return `${this.landingPage}${conversationId}`;
  },
};
