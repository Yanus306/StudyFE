package kr.ac.anu.checklist.data.remote

import kr.ac.anu.checklist.data.model.checklist.ChecklistCheckRequest
import kr.ac.anu.checklist.data.model.checklist.ChecklistItemResponse
import kr.ac.anu.checklist.data.model.checklist.HistoryResponse
import kr.ac.anu.checklist.data.model.checklist.MessageResponse
import kr.ac.anu.checklist.data.model.checklist.TodayChecklistResponse
import kr.ac.anu.checklist.data.model.checklist.TodayProgressResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.HTTP
import retrofit2.http.POST

interface ChecklistApi {
    @GET("checklist/items")
    suspend fun getChecklistItems(): List<ChecklistItemResponse>

    @GET("checklist/today")
    suspend fun getTodayCheckedItems(): TodayChecklistResponse

    @GET("checklist/today-progress")
    suspend fun getTodayProgress(): TodayProgressResponse

    @POST("checklist/check")
    suspend fun checkItem(
        @Body request: ChecklistCheckRequest
    ): MessageResponse

    @HTTP(method = "DELETE", path = "checklist/check", hasBody = true)
    suspend fun uncheckItem(
        @Body request: ChecklistCheckRequest
    ): MessageResponse

    @GET("checklist/history")
    suspend fun getHistory(): HistoryResponse
}
