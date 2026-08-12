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

sealed class MainState {
    data object Idle : MainState()
    data object Loading : MainState()

    data class Success(
        val user: UserMeResponse
    ) : MainState()

    data class Fail(
        val message: String
    ) : MainState()
}

@HiltViewModel
class MainViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {
    private val _mainState = MutableLiveData<MainState>(MainState.Idle)
    val mainState: LiveData<MainState> = _mainState

    fun loadMyInfo() {
        viewModelScope.launch {
            _mainState.value = MainState.Loading

            try {
                val user = userRepository.getMyInfo()
                _mainState.value = MainState.Success(user)
            } catch (e: HttpException) {
                _mainState.value = MainState.Fail("사용자 정보를 불러오지 못했습니다. (${e.code()})")
            } catch (e: IOException) {
                _mainState.value = MainState.Fail("서버에 연결할 수 없습니다.")
            } catch (e: Exception) {
                _mainState.value = MainState.Fail("사용자 정보를 불러오는 중 오류가 발생했습니다.")
            }
        }
    }
}
