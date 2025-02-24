document.addEventListener('DOMContentLoaded', function () {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }

    const editorGroups = document.querySelectorAll('.editor-group');
    
    editorGroups.forEach(group => {
        const toggleBtn = group.querySelector('.toggle-btn');
        const indicator = group.querySelector('.indicator');
        const editorContainer = group.querySelector('.editor-container');
        const interimTextarea = group.querySelector('.interim-textarea');
        const quill = new Quill(editorContainer, {
            theme: 'snow'
        });

        interimTextarea.style.display = 'none';

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        let finalTranscript = '';
        let isListening = false;

        recognition.onresult = function (event) {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    quill.clipboard.dangerouslyPasteHTML(quill.getLength() - 1, `<span>${transcript} </span>`);
                    interimTextarea.value = '';
                } else {
                    interimTranscript += transcript;
                }
            }

            if (interimTranscript) {
                interimTextarea.value = interimTranscript;
            }
        };

        toggleBtn.addEventListener('click', function () {
            if (!isListening) {
                recognition.start();
                isListening = true;
                toggleBtn.innerHTML = '<i class="fas fa-pause"></i> '; 
                toggleBtn.classList.remove('btn-primary');
                toggleBtn.classList.add('btn-warning'); 
                indicator.textContent = 'Listening... You can speak now!';

                interimTextarea.style.display = 'block';
            } else {
                recognition.stop();
                isListening = false;
                toggleBtn.innerHTML = '<i class="fas fa-microphone"></i> '; 
                toggleBtn.classList.remove('btn-warning'); 
                toggleBtn.classList.add('btn-primary'); 
                indicator.textContent = 'Record Stopped!';

                interimTextarea.style.display = 'none';
            }
        });

        recognition.onerror = function (event) {
            recognition.stop();
                isListening = false;
                toggleBtn.innerHTML = '<i class="fas fa-microphone"></i> '; 
                toggleBtn.classList.remove('btn-warning'); 
                toggleBtn.classList.add('btn-primary'); 
                indicator.textContent = 'Record Stopped!';

                interimTextarea.style.display = 'none';
        };

        const hiddenInput = group.querySelector('.quill-content');
        quill.on('text-change', function () {
            finalTranscript = quill.root.innerHTML;
            hiddenInput.value = finalTranscript; 
        });
    });
});