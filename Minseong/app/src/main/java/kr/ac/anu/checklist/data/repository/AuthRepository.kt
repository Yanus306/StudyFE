package kr.ac.anu.checklist.data.repository

import android.util.Log
import kr.ac.anu.checklist.data.local.TokenDataStore
import kr.ac.anu.checklist.data.model.auth.LoginRequest
import kr.ac.anu.checklist.data.model.auth.RegisterRequest
import kr.ac.anu.checklist.data.model.auth.RegisterResponse
import kr.ac.anu.checklist.data.remote.AuthApi
import javax.inject.Inject

class AuthRepository @Inject constructor(
    private val authApi: AuthApi,
    private val tokenDataStore: TokenDataStore
) {
    suspend fun login(
        username: String,
        password: String
    ) {
        val response = authApi.login(
            LoginRequest(
                username = username,
                password = password
            )
        )

        Log.d("LOGIN_CHECK", "raw response = $response")

        val token = response.get("token")?.asString

        Log.d("LOGIN_CHECK", "response token = $token")

        if (token.isNullOrBlank()) {
            throw IllegalStateException("로그인 응답에 토큰이 없습니다.")
        }

        tokenDataStore.saveToken(token)

        val savedToken = tokenDataStore.getToken()
        Log.d("LOGIN_CHECK", "saved token = $savedToken")
    }

    suspend fun register(
        username: String,
        password: String,
        name: String,
        affiliation: String,
        position: String
    ): RegisterResponse {
        return authApi.register(
            RegisterRequest(
                username = username,
                password = password,
                name = name,
                affiliation = affiliation,
                position = position
            )
        )
    }
}
