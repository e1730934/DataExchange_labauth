module.exports = {
    // method of operation
    get: {
      tags: ["USER CRUD operations"], // operation's tag.
      description: "Get users", // operation's desc.
      operationId: "getUsers", // unique operation id.
      parameters: [], // expected params.
      // expected responses
      responses: {
        // response code
        200: {
          description: "User were obtained", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                $ref: "#/components/schemas/User", // User model
              },
            },
          },
        },
      },
    },
  };