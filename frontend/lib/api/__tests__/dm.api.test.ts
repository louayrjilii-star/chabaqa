import { dmApi, normalizeDmMessage } from "@/lib/api/dm.api"
import { apiClient } from "@/lib/api/client"

jest.mock("@/lib/api/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    uploadFile: jest.fn(),
  },
}))

describe("dmApi contracts", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("normalizes message lifecycle fields and reactions", () => {
    const message = normalizeDmMessage({
      _id: "message-1",
      conversationId: "conversation-1",
      senderId: { _id: "user-1", name: "Lina" },
      recipientId: "user-2",
      text: "Hello",
      deletedAt: "2026-08-21T10:00:00.000Z",
      deletedFor: ["user-3"],
      clientRequestId: "request-1",
      reactions: [{ emoji: "👍", userIds: ["user-1"] }],
      attachments: [],
    })

    expect(message).toEqual(expect.objectContaining({
      id: "message-1",
      senderId: "user-1",
      deletedAt: "2026-08-21T10:00:00.000Z",
      deletedFor: ["user-3"],
      clientRequestId: "request-1",
      reactions: [expect.objectContaining({ emoji: "👍", userIds: ["user-1"] })],
    }))
  })

  it("sends the idempotency key accepted by the direct-message endpoint", async () => {
    ;(apiClient.post as jest.Mock).mockResolvedValue({
      data: {
        message: {
          _id: "message-1",
          conversationId: "conversation-1",
          senderId: "user-1",
          recipientId: "user-2",
          text: "Hello",
          attachments: [],
        },
      },
    })

    const response = await dmApi.sendMessage("conversation-1", {
      text: "Hello",
      clientRequestId: "request-1",
    })

    expect(apiClient.post).toHaveBeenCalledWith("/dm/conversation-1/messages", {
      text: "Hello",
      clientRequestId: "request-1",
    })
    expect(response.message.id).toBe("message-1")
  })

  it("normalizes search responses without requiring a conversation payload", async () => {
    ;(apiClient.get as jest.Mock).mockResolvedValue({
      data: {
        messages: [{
          _id: "message-1",
          conversationId: "conversation-1",
          senderId: "user-1",
          recipientId: "user-2",
          attachments: [],
        }],
        page: 1,
        total: 1,
        totalPages: 1,
        hasMore: false,
        limit: 20,
      },
    })

    const response = await dmApi.searchMessages("conversation-1", { q: "hello" })

    expect(apiClient.get).toHaveBeenCalledWith("/dm/conversation-1/messages/search", { q: "hello" })
    expect(response.messages[0].id).toBe("message-1")
    expect(response.total).toBe(1)
  })
})
