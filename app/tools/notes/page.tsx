'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ToolLayout from '@/components/ToolLayout';
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Quote, Undo, Redo, Save, Download, Upload, Trash2
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Notes() {
  const [notes, setNotes] = useState<Array<{ id: string; title: string; content: string; date: string }>>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('Untitled Note');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content: '<p>Welcome to your note-taking app! Start typing...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none dark:prose-invert min-h-[400px] px-4 py-3',
      },
    },
  });

  useEffect(() => {
    // Load notes from localStorage
    if (typeof window !== 'undefined') {
      const savedNotes = localStorage.getItem('notes');
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed);
      }
    }
  }, []);

  const saveNote = () => {
    if (!editor) return;

    const content = editor.getHTML();
    const now = new Date().toISOString();

    if (currentNoteId) {
      // Update existing note
      const updatedNotes = notes.map(note =>
        note.id === currentNoteId
          ? { ...note, title: noteTitle, content, date: now }
          : note
      );
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    } else {
      // Create new note
      const newNote = {
        id: Date.now().toString(),
        title: noteTitle,
        content,
        date: now,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setCurrentNoteId(newNote.id);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
    }
  };

  const loadNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note && editor) {
      editor.commands.setContent(note.content);
      setNoteTitle(note.title);
      setCurrentNoteId(noteId);
    }
  };

  const createNewNote = () => {
    if (editor) {
      editor.commands.setContent('<p>Start writing...</p>');
      setNoteTitle('Untitled Note');
      setCurrentNoteId(null);
    }
  };

  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(n => n.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    if (currentNoteId === noteId) {
      createNewNote();
    }
  };

  const exportNote = () => {
    if (!editor) return;
    const content = editor.getHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${noteTitle}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!editor) {
    return null;
  }

  return (
    <ToolLayout
      title="Note Taking"
      description="Create rich-text notes with formatting, lists, and more. All notes are saved locally."
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Notes List */}
        <div className="lg:col-span-1 space-y-3">
          <button
            onClick={createNewNote}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all text-sm"
          >
            + New Note
          </button>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {notes.map(note => (
              <div
                key={note.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  currentNoteId === note.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div onClick={() => loadNote(note.id)} className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {note.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(note.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-3 space-y-4">
          {/* Title */}
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full text-2xl font-bold px-4 py-2 border-b-2 border-gray-300 dark:border-gray-600 bg-transparent focus:outline-none focus:border-blue-500 text-gray-900 dark:text-white"
            placeholder="Note title..."
          />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('strike') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('code') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                editor.isActive('blockquote') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
            <div className="flex-1" />
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={exportNote}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Editor Content */}
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 min-h-[400px]">
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
