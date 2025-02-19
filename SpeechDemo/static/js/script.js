document.addEventListener('DOMContentLoaded', function() {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    const editorGroups = document.querySelectorAll('.editor-group');
    editorGroups.forEach(group => {
        const editorId = group.getAttribute('data-editor-id');
        const startBtn = group.querySelector('.start-btn');
        const pauseBtn = group.querySelector('.pause-btn');
        const stopBtn = group.querySelector('.stop-btn');
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

        startBtn.addEventListener('click', function() {
            if (!isListening) {
                recognition.start();
                isListening = true;
                indicator.textContent = 'Listening... You can speak now!';
            }
        });

        pauseBtn.addEventListener('click', function() {
            if (isListening) {
                recognition.stop();
                isListening = false;
                indicator.textContent = 'Recording paused. Click start to continue.';
            }
        });

        stopBtn.addEventListener('click', function() {
            if (isListening) {
                recognition.stop();
                isListening = false;
                indicator.textContent = 'Recording stopped.';
                quill.insertText(quill.getLength(), '\n--- Recording stopped ---\n');
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
