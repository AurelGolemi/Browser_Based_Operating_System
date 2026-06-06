let notes = document.getElementById('notes');

notes.addEventListener('dblclick', () => {
  const notes = window.open('', '_blank', 'width=400,height=300').document.write(`
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Notes</title>
        </head>
        <body>
            <textarea id="notes-textarea" placeholder="Enter your notes here..." style="width: 100%; height: 100%;"></textarea>
        </body>
        </html>`
  );
  if (notes) {
    item.setAttribute('data-notes', notes);
  }
})