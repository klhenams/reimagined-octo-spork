import Link from "next/link";

export default function RecoveryPage() {
  return (
    <div>
      <h2 className="text-3xl font-medium text-zinc-800 font-poppins mb-8">
        Recover your account
      </h2>

      <form>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="w-full h-12 border border-stone-500/30 rounded-xl px-4 focus:outline-none focus:border-blue-700/45"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full h-12 bg-blue-700 rounded-3xl text-white text-xl font-medium font-lato"
        >
          Send reset link
        </button>
      </form>
      <div className="mt-4 text-center flex gap-2 justify-center">
        <span className="text-zinc-800 text-base font-normal font-poppins">
          Remember your password?
        </span>
        <Link href="./login">
          <p className="text-neutral-900 text-base font-normal font-poppins underline">
            Log in
          </p>
        </Link>
      </div>
    </div>
  );
}
