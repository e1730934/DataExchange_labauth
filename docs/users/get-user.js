module.exports = {
    // operation's method
    get: {
      tags: ["USER CRUD operations"], // operation's tag.
      description: "Get user by email", // operation's desc.
      operationId: "getUserByEmail", // unique operation email
      parameters: [
        // expected params.
        {
          name: "email", // name of the param
          in: "path", // location of the param
          schema: {
            $ref: "#/components/schemas/email", // data model of the param
          },
          required: true, // Mandatory param
          description: "A single User email", // param desc.
        },
      ],
      // expected responses
      responses: {
        // response code
        200: {
          description: "User is obtained", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Email", // user data model
              },
            },
          },
        },
        // response code
        404: {
          description: "User is not found", // response desc.
          content: {
            // content-type
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error", // error data model
              },
            },
          },
        },
      },
    },
  };