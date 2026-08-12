package kr.ac.anu.checklist.data.model.checklist

data class HistoryResponse(
    val visitCount: Int,
    val averageRate: Int,
    val history: List<HistoryItemResponse>
)

data class HistoryItemResponse(
    val date: String,
    val dayOfWeek: String,
    val status: String,
    val checkedCount: Int,
    val totalCount: Int
)
