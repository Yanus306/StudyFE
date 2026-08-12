package kr.ac.anu.checklist.data.remote

import com.google.gson.JsonObject
import kr.ac.anu.checklist.data.model.auth.LoginRequest
import kr.ac.anu.checklist.data.model.auth.RegisterRequest
import kr.ac.anu.checklist.data.model.auth.RegisterResponse
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthApi {
    @POST("auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): JsonObject

    @POST("auth/register")
    suspend fun register(
        @Body request: RegisterRequest
    ): RegisterResponse
}
