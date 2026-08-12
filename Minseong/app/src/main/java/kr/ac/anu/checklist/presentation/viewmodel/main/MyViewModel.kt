package kr.ac.anu.checklist.presentation.viewmodel.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import kr.ac.anu.checklist.data.model.user.UserMeResponse
import kr.ac.anu.checklist.data.repository.UserRepository
import retrofit2.HttpException
import java.io.IOException
import javax.inject.Inject

sealed class MyState {
    data object Idle : MyState()
    data object Loading : MyState()

    data class Success(
        val user: UserMeResponse
    ) : MyState()

    data object LogoutSuccess : MyState()

    data class Fail(
        val message: String
    ) : MyState()
}

@HiltViewModel
class MyViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {
    private val _myState = MutableLiveData<MyState>(MyState.Idle)
    val myState: LiveData<MyState> = _myState

    fun loadMyInfo() {
        viewModelScope.launch {
            _myState.value = MyState.Loading

            try {
                val user = userRepository.getMyInfo()
                _myState.value = MyState.Success(user)
            } catch (e: HttpException) {
                _myState.value = MyState.Fail("내 정보를 불러오지 못했습니다. (${e.code()})")
            } catch (e: IOException) {
                _myState.value = MyState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _myState.value = MyState.Fail("내 정보를 불러오는 중 오류가 발생했습니다.")
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            userRepository.logout()
            _myState.value = MyState.LogoutSuccess
        }
    }
}
