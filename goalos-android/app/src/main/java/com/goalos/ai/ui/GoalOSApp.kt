package com.goalos.ai.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.TrackChanges
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.goalos.ai.GoalOSViewModel
import com.goalos.ai.MainTab
import com.goalos.ai.ui.components.AmbientBackground
import com.goalos.ai.ui.onboarding.OnboardingNav
import com.goalos.ai.ui.screens.CoachScreen
import com.goalos.ai.ui.screens.GoalScreen
import com.goalos.ai.ui.screens.InsightsScreen
import com.goalos.ai.ui.screens.ProfileScreen
import com.goalos.ai.ui.screens.TodayScreen
import com.goalos.ai.ui.components.FocusSprintDialog
import com.goalos.ai.ui.components.IntentGateDialog
import com.goalos.ai.ui.theme.GoalOSTokens

@Composable
fun GoalOSApp(vm: GoalOSViewModel, modifier: Modifier = Modifier) {
    val state by vm.userState.collectAsState()
    val tab by vm.activeTab.collectAsState()
    val score by vm.score.collectAsState()
    val coach by vm.coach.collectAsState()
    val coachMessages by vm.coachMessages.collectAsState()
    val weekly by vm.weekly.collectAsState()
    val intentApp by vm.intentApp.collectAsState()
    val showSprint by vm.showFocusSprint.collectAsState()

    if (!state.onboarded) {
        Box(Modifier.fillMaxSize()) {
            AmbientBackground()
            Box(Modifier.fillMaxSize().background(GoalOSTokens.ScreenGradient))
            OnboardingNav(
                modifier = modifier,
                onGoal = vm::saveGoal,
                onDna = vm::saveDna,
                onComplete = vm::completeOnboarding
            )
        }
        return
    }

    Box(Modifier.fillMaxSize()) {
        AmbientBackground()
        Box(Modifier.fillMaxSize().background(GoalOSTokens.ScreenGradient))

        Scaffold(
            modifier = modifier,
            containerColor = Color.Transparent,
            bottomBar = {
                Box(
                    Modifier
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                        .clip(RoundedCornerShape(28.dp))
                        .background(Color(0xE6061018))
                        .border(1.dp, Color(0x24FFFFFF), RoundedCornerShape(28.dp))
                ) {
                    NavigationBar(
                        containerColor = Color.Transparent,
                        tonalElevation = 0.dp
                    ) {
                        tabs.forEach { (t, label, icon) ->
                            val selected = tab == t
                            NavigationBarItem(
                                selected = selected,
                                onClick = { vm.setTab(t) },
                                icon = {
                                    Icon(
                                        icon,
                                        contentDescription = label,
                                        tint = if (selected) GoalOSTokens.Primary else GoalOSTokens.TextDim
                                    )
                                },
                                label = {
                                    Text(
                                        label,
                                        fontSize = 10.sp,
                                        fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (selected) GoalOSTokens.Primary else GoalOSTokens.TextDim
                                    )
                                },
                                colors = androidx.compose.material3.NavigationBarItemDefaults.colors(
                                    selectedIconColor = GoalOSTokens.Primary,
                                    selectedTextColor = GoalOSTokens.Primary,
                                    indicatorColor = Color(0x332BE7A8),
                                    unselectedIconColor = GoalOSTokens.TextDim,
                                    unselectedTextColor = GoalOSTokens.TextDim
                                )
                            )
                        }
                    }
                }
            }
        ) { padding ->
            when (tab) {
                MainTab.TODAY -> TodayScreen(
                    modifier = Modifier.padding(padding),
                    state = state,
                    score = score,
                    coach = coach,
                    onSprint = vm::openFocusSprint,
                    onIntent = vm::openIntentGate,
                    onRefreshUsage = vm::refreshUsage,
                    hasPermission = vm.hasUsagePermission(),
                    onRequestPermission = { }
                )
                MainTab.GOAL -> GoalScreen(
                    modifier = Modifier.padding(padding),
                    state = state,
                    onClassify = vm::classifyApp,
                    onIntent = vm::openIntentGate,
                    hasPermission = vm.hasUsagePermission(),
                    usageIntent = vm.usageSettingsIntent()
                )
                MainTab.COACH -> CoachScreen(
                    modifier = Modifier.padding(padding),
                    state = state,
                    coach = coach,
                    messages = coachMessages,
                    onSend = vm::sendCoachMessage,
                    onAction = { action -> vm.handleCoachAction(action, vm::openFocusSprint) },
                    onSprint = vm::openFocusSprint,
                    onRefresh = vm::refreshCoachChat
                )
                MainTab.INSIGHTS -> InsightsScreen(Modifier.padding(padding), state, score, weekly)
                MainTab.YOU -> ProfileScreen(
                    Modifier.padding(padding),
                    state,
                    weekly,
                    vm::updateDisplayName,
                    vm::resetAll
                )
            }
        }

        intentApp?.let { app ->
            IntentGateDialog(app = app, onSelect = vm::recordIntent, onDismiss = vm::closeIntentGate)
        }

        if (showSprint) {
            FocusSprintDialog(
                goalTemplate = state.goal?.templateId,
                onComplete = vm::completeFocusSprint,
                onDismiss = vm::closeFocusSprint
            )
        }
    }
}

private val tabs = listOf(
    Triple(MainTab.TODAY, "Today", Icons.Default.CalendarToday),
    Triple(MainTab.GOAL, "Goal", Icons.Default.TrackChanges),
    Triple(MainTab.COACH, "Coach", Icons.Default.AutoAwesome),
    Triple(MainTab.INSIGHTS, "Insights", Icons.Default.BarChart),
    Triple(MainTab.YOU, "You", Icons.Default.Person)
)
