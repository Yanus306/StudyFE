package kr.ac.anu.checklist.presentation.viewmodel.auth

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class LoginState {
    object Loading : LoginState()
    object Success : LoginState()
    data class Fail(
        val message: String
    ) : LoginState()
}

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val repository: AuthRepository
) : ViewModel() {
    private val _loginState = MutableLiveData<LoginState>()
    val loginState: LiveData<LoginState> = _loginState

    fun login(id: String, pw: String) {
        if (id.isBlank() || pw.isBlank()) {
            _loginState.value = LoginState.Fail("아이디와 비밀번호를 입력해주세요.")
            return
        }

        viewModelScope.launch {
            _loginState.value = LoginState.Loading

            try {

            }
        }
    }

}
