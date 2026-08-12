package kr.ac.anu.checklist.data.model.auth

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    @SerializedName("token")
    val token: String? = null
)

data class RegisterRequest(
    val username: String,
    val password: String,
    val name: String,
    val affiliation: String,
    val position: String
)

data class RegisterResponse(
    val message: String
)
