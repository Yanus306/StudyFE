package kr.ac.anu.checklist.data.remote

import android.util.Log
import kotlinx.coroutines.runBlocking
import kr.ac.anu.checklist.data.local.TokenDataStore
import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

class AuthInterceptor @Inject constructor(
    private val tokenDataStore: TokenDataStore
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = runBlocking {
            tokenDataStore.getToken()
        }

        val originalRequest = chain.request()

        Log.d("TOKEN_CHECK", "url = ${originalRequest.url}")
        Log.d("TOKEN_CHECK", "token = $token")

        val newRequest = if (token.isNullOrBlank()) {
            originalRequest
        } else {
            originalRequest.newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        }

        Log.d("TOKEN_CHECK", "Authorization = ${newRequest.header("Authorization")}")

        return chain.proceed(newRequest)
    }
}
