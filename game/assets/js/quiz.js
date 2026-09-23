/**
 * EDUQUEST - Quiz System UI & Modal Controller (Phase 4)
 */

window.QuizSystem = {
    isOpen: false,
    attemptId: null,
    questId: null,
    questionIds: [],
    currentIndex: 0,
    currentQuestion: null,
    selectedAnswerId: null,
    hasAnsweredCurrent: false,

    init() {
        if (document.getElementById('quizOverlay')) return;

        // Inject Quiz Modal Overlay HTML into Body
        const modalHtml = `
            <div id="quizOverlay" class="quiz-overlay">
                <div class="quiz-modal-card">
                    <!-- Header -->
                    <div class="quiz-header">
                        <div class="quiz-title-group">
                            <span class="quiz-title">✏️ QUIZ EDUQUEST</span>
                            <span id="quizCategoryBadge" class="quiz-badge">General</span>
                        </div>
                        <span id="quizProgressCounter" class="quiz-progress-counter">Pertanyaan 1 / 5</span>
                    </div>

                    <!-- Progress Bar -->
                    <div class="quiz-progress-track">
                        <div id="quizProgressFill" class="quiz-progress-fill"></div>
                    </div>

                    <!-- Question Container Screen -->
                    <div id="quizQuestionScreen">
                        <div class="quiz-question-box">
                            <div id="quizQuestionText" class="quiz-question-text">Memuat pertanyaan...</div>
                        </div>

                        <!-- Choice Options Grid -->
                        <div id="quizChoicesGrid" class="quiz-choices-grid"></div>

                        <!-- Feedback Banner -->
                        <div id="quizFeedbackBox" class="quiz-feedback-box"></div>

                        <!-- Footer Action Buttons -->
                        <div class="quiz-footer-actions">
                            <button id="quizCancelBtn" onclick="QuizSystem.closeQuiz()" class="btn btn-secondary btn-sm">Batal</button>
                            <button id="quizSubmitBtn" onclick="QuizSystem.submitAnswer()" class="btn btn-primary btn-sm" disabled>Kirim Jawaban</button>
                            <button id="quizNextBtn" onclick="QuizSystem.nextQuestion()" class="btn btn-success btn-sm" style="display: none;">Pertanyaan Selanjutnya ➔</button>
                        </div>
                    </div>

                    <!-- Result Summary Screen -->
                    <div id="quizResultScreen" class="quiz-result-box" style="display: none;">
                        <div id="quizScoreCircle" class="quiz-score-circle passed">
                            <span id="quizScoreVal">80</span>
                            <span class="quiz-score-label">NILAI</span>
                        </div>
                        <div id="quizResultTitle" class="quiz-result-title passed">SELAMAT! ANDA LULUS</div>
                        <div id="quizResultDesc" class="quiz-result-desc">Kamu telah memenuhi syarat nilai minimal 60 untuk menyelesaikan quest ini.</div>

                        <div class="quiz-footer-actions" style="justify-content: center;">
                            <button id="quizRetryBtn" onclick="QuizSystem.startQuiz(QuizSystem.questId)" class="btn btn-outline btn-sm" style="display: none;">🔄 Coba Lagi</button>
                            <button onclick="QuizSystem.closeQuiz()" class="btn btn-primary btn-sm">Lanjutkan Quest ➔</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    async startQuiz(questId) {
        this.init();
        this.questId = questId;
        this.attemptId = null;
        this.currentIndex = 0;
        this.questionIds = [];
        this.selectedAnswerId = null;
        this.hasAnsweredCurrent = false;

        try {
            const resp = await fetch('../api/quiz/start.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quest_id: questId })
            });

            const data = await resp.json();

            if (!data.success) {
                if (window.QuestSystem) {
                    QuestSystem.showToast(data.message || 'Gagal memulai kuis.', 'warning');
                } else {
                    alert(data.message);
                }
                return;
            }

            this.attemptId = data.attempt_id;
            this.questionIds = data.question_ids || [];
            this.isOpen = true;

            // Show Overlay
            const overlay = document.getElementById('quizOverlay');
            if (overlay) overlay.classList.add('active');

            // Reset screens
            document.getElementById('quizQuestionScreen').style.display = 'block';
            document.getElementById('quizResultScreen').style.display = 'none';

            this.loadQuestion(0);
        } catch (e) {
            console.error('Quiz start error:', e);
            if (window.QuestSystem) QuestSystem.showToast('Terjadi kesalahan jaringan.', 'warning');
        }
    },

    async loadQuestion(index) {
        if (index < 0 || index >= this.questionIds.length) return;

        this.currentIndex = index;
        this.selectedAnswerId = null;
        this.hasAnsweredCurrent = false;

        const qId = this.questionIds[index];
        const total = this.questionIds.length;

        // Update Header & Progress Fill
        document.getElementById('quizProgressCounter').innerText = `Pertanyaan ${index + 1} / ${total}`;
        document.getElementById('quizProgressFill').style.width = `${((index + 1) / total) * 100}%`;

        // Hide Feedback & Next button, Reset Submit button
        const fb = document.getElementById('quizFeedbackBox');
        fb.style.display = 'none';
        fb.className = 'quiz-feedback-box';

        const submitBtn = document.getElementById('quizSubmitBtn');
        submitBtn.style.display = 'inline-block';
        submitBtn.disabled = true;
        submitBtn.innerText = 'Kirim Jawaban';

        const nextBtn = document.getElementById('quizNextBtn');
        nextBtn.style.display = 'none';

        try {
            const resp = await fetch(`../api/quiz/question.php?attempt_id=${this.attemptId}&question_id=${qId}`);
            const data = await resp.json();

            if (!data.success) {
                alert(data.message || 'Gagal memuat pertanyaan.');
                return;
            }

            const q = data.question;
            this.currentQuestion = q;

            document.getElementById('quizCategoryBadge').innerText = q.category || 'General';
            document.getElementById('quizQuestionText').innerText = `${index + 1}. ${q.question_text}`;

            // Render Choices Grid
            const choicesGrid = document.getElementById('quizChoicesGrid');
            choicesGrid.innerHTML = '';

            const labels = ['A', 'B', 'C', 'D'];

            q.choices.forEach((c, idx) => {
                const label = labels[idx] || (idx + 1);
                const btn = document.createElement('button');
                btn.className = 'quiz-choice-btn';
                btn.type = 'button';
                btn.setAttribute('data-id', c.id);

                const labelSpan = document.createElement('span');
                labelSpan.className = 'quiz-choice-label';
                labelSpan.textContent = label;

                const textSpan = document.createElement('span');
                textSpan.className = 'quiz-choice-text';
                textSpan.textContent = c.answer_text ?? '';

                btn.appendChild(labelSpan);
                btn.appendChild(document.createTextNode(' '));
                btn.appendChild(textSpan);

                btn.onclick = () => this.selectChoice(c.id, btn);
                choicesGrid.appendChild(btn);
            });

            // If already answered previously in attempt
            if (data.is_answered) {
                this.hasAnsweredCurrent = true;
                this.selectedAnswerId = data.user_answer;
                // Highlight user choice
                Array.from(choicesGrid.children).forEach(b => {
                    b.disabled = true;
                    if (parseInt(b.getAttribute('data-id')) === data.user_answer) {
                        b.classList.add('selected');
                    }
                });
                submitBtn.style.display = 'none';
                nextBtn.style.display = 'inline-block';
                nextBtn.innerText = (index + 1 === total) ? 'Lihat Hasil Kuis ➔' : 'Pertanyaan Selanjutnya ➔';
            }
        } catch (e) {
            console.error('Error loading question:', e);
        }
    },

    selectChoice(choiceId, element) {
        if (this.hasAnsweredCurrent) return;

        this.selectedAnswerId = choiceId;

        // Reset previous selections
        const grid = document.getElementById('quizChoicesGrid');
        Array.from(grid.children).forEach(child => child.classList.remove('selected'));

        element.classList.add('selected');
        document.getElementById('quizSubmitBtn').disabled = false;
    },

    async submitAnswer() {
        if (!this.selectedAnswerId || this.hasAnsweredCurrent) return;

        const qId = this.questionIds[this.currentIndex];
        const submitBtn = document.getElementById('quizSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.innerText = 'Memeriksa...';

        try {
            const resp = await fetch('../api/quiz/answer.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    attempt_id: this.attemptId,
                    question_id: qId,
                    answer_id: this.selectedAnswerId
                })
            });

            const data = await resp.json();

            if (!data.success) {
                alert(data.message || 'Gagal mengirim jawaban.');
                submitBtn.disabled = false;
                submitBtn.innerText = 'Kirim Jawaban';
                return;
            }

            this.hasAnsweredCurrent = true;

            // Show Feedback Banner
            const fb = document.getElementById('quizFeedbackBox');
            fb.innerText = data.message;
            fb.className = `quiz-feedback-box ${data.is_correct ? 'correct' : 'wrong'}`;

            // Disable all choice buttons
            const grid = document.getElementById('quizChoicesGrid');
            Array.from(grid.children).forEach(btn => {
                btn.disabled = true;
                const bId = parseInt(btn.getAttribute('data-id'));
                if (bId === this.selectedAnswerId) {
                    btn.classList.add(data.is_correct ? 'correct-choice' : 'wrong-choice');
                }
            });

            // Toggle Action Buttons
            submitBtn.style.display = 'none';
            const nextBtn = document.getElementById('quizNextBtn');
            nextBtn.style.display = 'inline-block';
            nextBtn.innerText = (this.currentIndex + 1 === this.questionIds.length) ? 'Lihat Hasil Kuis ➔' : 'Pertanyaan Selanjutnya ➔';
        } catch (e) {
            console.error('Submit answer error:', e);
            submitBtn.disabled = false;
            submitBtn.innerText = 'Kirim Jawaban';
        }
    },

    nextQuestion() {
        if (this.currentIndex + 1 < this.questionIds.length) {
            this.loadQuestion(this.currentIndex + 1);
        } else {
            this.finishQuiz();
        }
    },

    async finishQuiz() {
        try {
            const resp = await fetch('../api/quiz/finish.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attempt_id: this.attemptId })
            });

            const data = await resp.json();

            if (!data.success) {
                alert(data.message || 'Gagal menyelesaikan kuis.');
                return;
            }

            // Render Result Screen
            document.getElementById('quizQuestionScreen').style.display = 'none';

            const resScreen = document.getElementById('quizResultScreen');
            resScreen.style.display = 'block';

            const scoreCircle = document.getElementById('quizScoreCircle');
            const scoreVal = document.getElementById('quizScoreVal');
            const resTitle = document.getElementById('quizResultTitle');
            const resDesc = document.getElementById('quizResultDesc');
            const retryBtn = document.getElementById('quizRetryBtn');

            scoreVal.innerText = data.score;

            if (data.passed) {
                scoreCircle.className = 'quiz-score-circle passed';
                resTitle.className = 'quiz-result-title passed';
                resTitle.innerText = '🏆 SELAMAT! ANDA LULUS';
                resDesc.innerText = `Anda meraih nilai ${data.score}/100 (${data.correct_answers}/${data.total_questions} Benar). Quest sekarang dapat diselesaikan!`;
                retryBtn.style.display = 'none';
            } else {
                scoreCircle.className = 'quiz-score-circle failed';
                resTitle.className = 'quiz-result-title failed';
                resTitle.innerText = '⚠️ BELUM LULUS';
                resDesc.innerText = `Anda meraih nilai ${data.score}/100 (${data.correct_answers}/${data.total_questions} Benar). Kamu membutuhkan nilai minimal 60 untuk lulus. Silakan coba lagi!`;
                retryBtn.style.display = 'inline-block';
            }
        } catch (e) {
            console.error('Finish quiz error:', e);
        }
    },

    closeQuiz() {
        this.isOpen = false;
        const overlay = document.getElementById('quizOverlay');
        if (overlay) overlay.classList.remove('active');
    }
};
