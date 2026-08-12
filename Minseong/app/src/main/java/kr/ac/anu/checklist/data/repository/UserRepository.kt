package kr.ac.anu.checklist.data.repository

import kr.ac.anu.checklist.data.local.TokenDataStore
import kr.ac.anu.checklist.data.remote.UserApi
import javax.inject.Inject

class UserRepository @Inject constructor(
    private val userApi: UserApi,
    private val tokenDataStore: TokenDataStore
) {
    suspend fun getMyInfo() = userApi.getMyInfo()

    suspend fun logout() {
        tokenDataStore.clearToken()
    }
}
