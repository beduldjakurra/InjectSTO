export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🚀 STO PWA Test Page
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Server berjalan dengan baik!
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ Next.js 15.3.5</p>
          <p className="text-sm text-gray-500">✅ React 19</p>
          <p className="text-sm text-gray-500">✅ TypeScript</p>
          <p className="text-sm text-gray-500">✅ Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}