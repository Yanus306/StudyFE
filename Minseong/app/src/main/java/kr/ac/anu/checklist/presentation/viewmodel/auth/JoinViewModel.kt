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

sealed class JoinState {
    data object Idle : JoinState()

    data object Loading : JoinState()

    data object Success : JoinState()

    data class Fail(val message: String) : JoinState()
}

@HiltViewModel
class JoinViewModel @Inject constructor(
    private val repository: AuthRepository
) : ViewModel() {
    private val _joinState = MutableLiveData<JoinState>()
    val joinState: LiveData<JoinState> = _joinState

    fun register(
        id: String,
        pw: String,
        name: String,
        affiliation: String,
        position: String
    ) {
        if (
            id.isBlank() ||
            pw.isBlank() ||
            name.isBlank() ||
            affiliation.isBlank() ||
            position.isBlank()
        ) {
            _joinState.postValue(JoinState.Fail("모든 항목을 입력해주세요."))
            return
        }

        viewModelScope.launch {
            _joinState.postValue(JoinState.Loading)

            try {
                repository.register(
                    username = id,
                    password = pw,
                    name = name,
                    affiliation = affiliation,
                    position = position
                )

                _joinState.value = JoinState.Success
            } catch (e: HttpException) {
                _joinState.value = JoinState.Fail(
                    when (e.code()) {
                        400 -> "필수값을 모두 입력해주세요."
                        409 -> "이미 사용 중인 아이디입니다."
                        500 -> "서버 오류가 발생했습니다."
                        else -> "회원가입에 실패했스빈다. (${e.code()}"
                    }
                )
            } catch (e: IOException) {
                _joinState.value = JoinState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _joinState.value = JoinState.Fail("알 수 없는 오류가 발생했습니다.")
            }
        }
    }
}
