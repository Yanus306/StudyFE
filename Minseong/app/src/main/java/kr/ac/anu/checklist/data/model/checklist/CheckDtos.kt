package kr.ac.anu.checklist.data.model.checklist

data class TodayChecklistResponse(
    val checkedItemIds: List<Int>
)

data class TodayProgressResponse(
    val checkedCount: Int,
    val totalCount: Int
)

data class ChecklistCheckRequest(
    val itemId: Int
)

data class MessageResponse(
    val message: String
)
