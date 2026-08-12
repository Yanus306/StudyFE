package kr.ac.anu.checklist.data.model.user

data class UserMeResponse(
    val id: Int,
    val username: String,
    val name: String,
    val affiliation: String,
    val position: String
)

data class UpdateUserRequest(
    val name: String,
    val affiliation: String? = null,
    val position: String? = null
)
