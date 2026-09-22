import { useEffect, useRef, useState } from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';

export default function GlobalAlertModal() {
  const [message, setMessage] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const nativeAlert = window.alert;
    window.alert = (value?: unknown) => setMessage(String(value ?? ''));
    return () => { window.alert = nativeAlert; };
  }, []);

  useEffect(() => {
    if (!message) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMessage(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [message]);

  if (!message) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4" role="presentation">
      <button className="absolute inset-0 bg-gray-950/45" aria-label="Close message" onClick={() => setMessage(null)} />
      <section role="alertdialog" aria-modal="true" aria-labelledby="alert-title" className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button ref={closeButtonRef} type="button" onClick={() => setMessage(null)} className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700" aria-label="Close">
          <FiX className="h-5 w-5" />
        </button>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-pink-100 text-pink-600">
          <FiAlertCircle className="h-6 w-6" />
        </div>
        <h2 id="alert-title" className="pr-8 text-xl font-bold text-gray-900">Notice</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">{message}</p>
        <button type="button" onClick={() => setMessage(null)} className="mt-6 w-full rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-pink-700">
          Okay
        </button>
      </section>
    </div>
  );
}
