document.addEventListener('DOMContentLoaded', function() {
    const sheetId = '1c7TVZyrAjCY047zFpEKfN1bqRPscivuHio6BMttoDC8';
    const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=Sheet1`;

    fetch(base)
        .then(res => res.text())
        .then(data => {
            const jsonData = JSON.parse(data.substr(47).slice(0, -2));
            const rows = jsonData.table.rows;
            const soundboard = document.getElementById('soundboard');
            const search = document.getElementById('search');

            let sounds = rows.map(row => {
                return {
                    title: row.c[0].v,
                    category: row.c[1].v,
                    description: row.c[2].v,
                    url: row.c[3].v
                };
            });

            function displaySounds(sounds) {
                soundboard.innerHTML = '';
                sounds.forEach(sound => {
                    const button = document.createElement('button');
                    button.className = 'sound-button';
                    button.innerText = `${sound.title} (${sound.category})\n${sound.description}`;
                    button.onclick = () => {
                        const audio = new Audio(sound.url);
                        audio.play();
                    };
                    soundboard.appendChild(button);
                });
            }

            search.addEventListener('input', () => {
                const query = search.value.toLowerCase();
                const filteredSounds = sounds.filter(sound =>
                    sound.title.toLowerCase().includes(query) ||
                    sound.category.toLowerCase().includes(query) ||
                    sound.description.toLowerCase().includes(query)
                );
                displaySounds(filteredSounds);
            });

            window.sortTable = function(type) {
                sounds.sort((a, b) => {
                    if (a[type] < b[type]) return -1;
                    if (a[type] > b[type]) return 1;
                    return 0;
                });
                displaySounds(sounds);
            };

            displaySounds(sounds);
        });
});
