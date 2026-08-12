package kr.ac.anu.checklist.data.remote

import kr.ac.anu.checklist.data.model.user.UpdateUserRequest
import kr.ac.anu.checklist.data.model.user.UserMeResponse
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT

interface UserApi {
    @GET("user/me")
    suspend fun getMyInfo(): UserMeResponse

    @PUT("user/me")
    suspend fun updateMyInfo(
        @Body request: UpdateUserRequest
    ): UserMeResponse
}
