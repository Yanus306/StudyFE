package kr.ac.anu.checklist.data.repository

import kr.ac.anu.checklist.data.model.checklist.ChecklistCheckRequest
import kr.ac.anu.checklist.data.model.checklist.ChecklistItemResponse
import kr.ac.anu.checklist.data.model.checklist.HistoryResponse
import kr.ac.anu.checklist.data.model.checklist.TodayChecklistResponse
import kr.ac.anu.checklist.data.model.checklist.TodayProgressResponse
import kr.ac.anu.checklist.data.remote.ChecklistApi
import javax.inject.Inject

class CheckListRepository @Inject constructor(
    private val checklistApi: ChecklistApi
) {
    suspend fun getChecklistItems(): List<ChecklistItemResponse> {
        return checklistApi.getChecklistItems()
    }

    suspend fun getTodayCheckedItems(): TodayChecklistResponse {
        return checklistApi.getTodayCheckedItems()
    }

    suspend fun getTodayProgress(): TodayProgressResponse {
        return checklistApi.getTodayProgress()
    }

    suspend fun checkItem(itemId: Int) {
        checklistApi.checkItem(
            ChecklistCheckRequest(itemId = itemId)
        )
    }

    suspend fun uncheckItem(itemId: Int) {
        checklistApi.uncheckItem(
            ChecklistCheckRequest(itemId = itemId)
        )
    }

    suspend fun getHistory(): HistoryResponse {
        return checklistApi.getHistory()
    }
}
