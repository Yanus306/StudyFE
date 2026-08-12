package kr.ac.anu.checklist.presentation.viewmodel.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import kr.ac.anu.checklist.data.repository.AuthRepository
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject

sealed class LoginState {
    data object Idle : LoginState()

    data object Loading : LoginState()

    data object Success : LoginState()

    data class Fail(
        val message: String
    ) : LoginState()
}

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val repository: AuthRepository
) : ViewModel() {
    private val _loginState = MutableLiveData<LoginState>(LoginState.Idle)
    val loginState: LiveData<LoginState> = _loginState

    fun login(
        id: String,
        pw: String
    ) {
        if (id.isBlank() || pw.isBlank()) {
            _loginState.value = LoginState.Fail("아이디와 비밀번호를 입력해주세요.")
            return
        }

        viewModelScope.launch {
            _loginState.value = LoginState.Loading

            try {
                repository.login(
                    username = id,
                    password = pw
                )

                _loginState.value = LoginState.Success
            } catch (e: HttpException) {
                _loginState.value = LoginState.Fail(
                    when (e.code()) {
                        400 -> "입력값을 확인해주세요."
                        401 -> "아이디 또는 비밀번호가 올바르지 않습니다."
                        404 -> "로그인 API 주소를 찾을 수 없습니다."
                        500 -> "서버 오류가 발생했습니다."
                        else -> "로그인에 실패했습니다. (${e.code()})"
                    }
                )
            } catch (e: IOException) {
                _loginState.value = LoginState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _loginState.value = LoginState.Fail("알 수 없는 오류가 발생했습니다.")
            }
        }
    }
}
