document.addEventListener('DOMContentLoaded', function() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    const editorGroups = document.querySelectorAll('.editor-group');
    editorGroups.forEach(group => {
        const toggleBtn = group.querySelector('.toggle-btn'); // Single toggle button
        const indicator = group.querySelector('.indicator');
        const editorContainer = group.querySelector('.editor-container');

        const quill = new Quill(editorContainer, {
            theme: 'snow'
        });

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';
        let isListening = false;

        recognition.onresult = function(event) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    // finalTranscript += transcript;
                    // console.log(finalTranscript);
                    // quill.setText(`${finalTranscript}`);
                    quill.clipboard.dangerouslyPasteHTML(quill.getLength() - 1, `<span>${transcript}</span>`);
                } else {
                    interimTranscript += transcript;
                }
            }
        };

        // Toggle between Record and Pause
        toggleBtn.addEventListener('click', function() {
            if (!isListening) {
                // Start recording
                recognition.start();
                isListening = true;
                toggleBtn.innerHTML = '<i class="fas fa-pause"></i> '; // Change button to Pause
                toggleBtn.classList.remove('btn-primary'); // Remove the primary class
                toggleBtn.classList.add('btn-warning'); // Add the warning class (for pause state)
                indicator.textContent = 'Listening... You can speak now!';
            } else {
                // Pause recording
                recognition.stop();
                isListening = false;
                toggleBtn.innerHTML = '<i class="fas fa-microphone"></i> '; // Change button to Record
                toggleBtn.classList.remove('btn-warning'); // Remove the primary class
                toggleBtn.classList.add('btn-primary'); // Add the warning class (for pause state)
                indicator.textContent = 'Recording paused. Click Record to continue.';
            }
        });

        recognition.onerror = function(event) {
            quill.insertText(quill.getLength(), `\n[-] Error with recording, there's another recording started.\n`);
            indicator.textContent = 'Error .. Recording stopped because another record started!';
        };

        // Update finalTranscript when user types in Quill editor
        quill.on('text-change', function () {
            finalTranscript = quill.root.innerHTML;            // Update final transcript
            console.log(finalTranscript);
        });
    });
});
