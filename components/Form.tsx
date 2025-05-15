import React, { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  business_description: string;
  website_url?: string;
  competitors?: string;
  target_audience?: string;
  audience_problem?: string;
  your_solution?: string;
  goal?: string;
  region?: string;
};

type Props = {
  onSubmitForm: (data: FormData) => void;
};

const Form: React.FC<Props> = ({ onSubmitForm }) => {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const [showMore, setShowMore] = useState(false);

  const onSubmit = (data: FormData) => {
    onSubmitForm(data);
  };

  const businessDesc = watch("business_description");

  return (
    <form className="space-y-6 bg-white p-6 rounded-md shadow" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block font-semibold text-gray-800 mb-1">What does your business do? *</label>
        <textarea
          {...register("business_description", { required: true, minLength: 15 })}
          placeholder="E.g., We help DTC brands increase Shopify conversions..."
          className="w-full border border-gray-300 p-3 rounded text-sm"
          rows={3}
        />
      </div>

      {businessDesc?.length > 15 && (
        <>
          <div className="flex items-center justify-start gap-x-4 mt-4">
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
            >
              Generate Keywords
            </button>

            <button
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              className="text-sm text-blue-500 underline"
            >
              {showMore ? "Hide extra fields" : "Add more context (optional)"}
            </button>
          </div>

          {showMore && (
            <div className="grid gap-4 mt-4">
              <input
                {...register("website_url")}
                placeholder="Website URL"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                {...register("competitors")}
                placeholder="Competitors"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                {...register("target_audience")}
                placeholder="Target Audience"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                {...register("audience_problem")}
                placeholder="Biggest Problem"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
              <input
                {...register("your_solution")}
                placeholder="Your Solution"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />

              {/* Custom-styled select with arrow */}
              <div className="relative">
                <select
                  {...register("goal")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-10 appearance-none bg-white"
                >
                  <option value="">Select goal</option>
                  <option value="traffic">Traffic</option>
                  <option value="conversions">Conversions</option>
                  <option value="signups">Newsletter Signups</option>
                  <option value="discovery">Product Discovery</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 12a1 1 0 01-.707-.293l-3-3a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <input
                {...register("region")}
                placeholder="Target Region (e.g. US, India)"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          )}
        </>
      )}

      {businessDesc?.length <= 15 && (
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Generate Keywords
        </button>
      )}
    </form>
  );
};

export default Form;