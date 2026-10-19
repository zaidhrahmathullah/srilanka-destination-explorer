"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Save,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { Destination } from "@/types/destination";

type DestinationFormProps = {
  mode: "create" | "edit";
  destination?: Destination;
};

type FormValues = {
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function getInitialValues(destination?: Destination): FormValues {
  return {
    name: destination?.name ?? "",
    description: destination?.description ?? "",
    latitude:
      destination?.latitude !== undefined
        ? String(destination.latitude)
        : "",
    longitude:
      destination?.longitude !== undefined
        ? String(destination.longitude)
        : "",
    imageUrl: destination?.imageUrl ?? "",
  };
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Destination name is required.";
  } else if (values.name.trim().length > 120) {
    errors.name = "Name cannot exceed 120 characters.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  } else if (values.description.trim().length > 3000) {
    errors.description = "Description cannot exceed 3000 characters.";
  }

  if (!values.latitude.trim()) {
    errors.latitude = "Latitude is required.";
  } else if (
    !Number.isFinite(Number(values.latitude)) ||
    Number(values.latitude) < -90 ||
    Number(values.latitude) > 90
  ) {
    errors.latitude = "Enter a valid latitude between -90 and 90.";
  }

  if (!values.longitude.trim()) {
    errors.longitude = "Longitude is required.";
  } else if (
    !Number.isFinite(Number(values.longitude)) ||
    Number(values.longitude) < -180 ||
    Number(values.longitude) > 180
  ) {
    errors.longitude = "Enter a valid longitude between -180 and 180.";
  }

  if (values.imageUrl.trim()) {
    try {
      const url = new URL(values.imageUrl.trim());

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        errors.imageUrl = "Enter a valid HTTP or HTTPS image URL.";
      }
    } catch {
      errors.imageUrl = "Enter a valid image URL.";
    }
  }

  return errors;
}

export default function AdminDestinationForm({
  mode,
  destination,
}: DestinationFormProps) {
  const router = useRouter();
  const isEditing = mode === "edit";

  const [values, setValues] = useState<FormValues>(() =>
    getInitialValues(destination),
  );

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) return;

    setServerError("");

    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (isEditing && !destination?._id) {
      setServerError("Destination information is missing.");
      return;
    }

    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
      imageUrl: values.imageUrl.trim() || null,
    };

    const endpoint =
      isEditing && destination
        ? `/destinations/${encodeURIComponent(destination._id)}`
        : "/destinations";

    setLoading(true);

    try {
      const response = await apiRequest(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        const message = Array.isArray(result?.message)
          ? result.message.join(". ")
          : typeof result?.message === "string"
            ? result.message
            : "Unable to save destination. Please try again.";

        throw new Error(message);
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 disabled:opacity-60";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
    >
      {serverError && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Destination Information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Enter the details displayed on the public website.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="destination-name"
            className="block text-sm font-medium text-slate-700"
          >
            Destination Name <span className="text-red-600">*</span>
          </label>

          <input
            id="destination-name"
            type="text"
            value={values.name}
            onChange={(event) =>
              updateField("name", event.target.value)
            }
            placeholder="e.g. Nuwara Eliya"
            maxLength={120}
            disabled={loading}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "destination-name-error" : undefined
            }
            className={inputClass}
          />

          {errors.name && (
            <p
              id="destination-name-error"
              className="text-xs text-red-600"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="destination-description"
            className="block text-sm font-medium text-slate-700"
          >
            Description <span className="text-red-600">*</span>
          </label>

          <textarea
            id="destination-description"
            rows={5}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Describe the destination..."
            maxLength={3000}
            disabled={loading}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description
                ? "destination-description-error"
                : undefined
            }
            className={`${inputClass} resize-y`}
          />

          <div className="flex items-center justify-between gap-3">
            {errors.description ? (
              <p
                id="destination-description-error"
                className="text-xs text-red-600"
              >
                {errors.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Write a short, informative description.
              </p>
            )}

            <span className="shrink-0 text-xs text-slate-400">
              {values.description.length}/3000
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-7">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-800">
            <MapPin className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Location Coordinates
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Coordinates are used to retrieve live weather data.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {(
            [
              {
                field: "latitude",
                label: "Latitude",
                placeholder: "e.g. 6.9497",
              },
              {
                field: "longitude",
                label: "Longitude",
                placeholder: "e.g. 80.7891",
              },
            ] as const
          ).map(({ field, label, placeholder }) => (
            <div key={field} className="space-y-2">
              <label
                htmlFor={`destination-${field}`}
                className="block text-sm font-medium text-slate-700"
              >
                {label} <span className="text-red-600">*</span>
              </label>

              <input
                id={`destination-${field}`}
                type="number"
                step="any"
                value={values[field]}
                onChange={(event) =>
                  updateField(field, event.target.value)
                }
                placeholder={placeholder}
                disabled={loading}
                aria-invalid={Boolean(errors[field])}
                aria-describedby={
                  errors[field]
                    ? `destination-${field}-error`
                    : undefined
                }
                className={inputClass}
              />

              {errors[field] && (
                <p
                  id={`destination-${field}-error`}
                  className="text-xs text-red-600"
                >
                  {errors[field]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-7">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-800">
            <ImageIcon className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Destination Image
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Optional. Leave empty to use the default destination image.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="destination-image"
            className="block text-sm font-medium text-slate-700"
          >
            Image URL
          </label>

          <input
            id="destination-image"
            type="url"
            value={values.imageUrl}
            onChange={(event) =>
              updateField("imageUrl", event.target.value)
            }
            placeholder="https://example.com/destination.jpg"
            disabled={loading}
            aria-invalid={Boolean(errors.imageUrl)}
            aria-describedby={
              errors.imageUrl ? "destination-image-error" : undefined
            }
            className={inputClass}
          />

          {errors.imageUrl && (
            <p
              id="destination-image-error"
              className="text-xs text-red-600"
            >
              {errors.imageUrl}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
        <Link
          href="/admin"
          aria-disabled={loading}
          onClick={(event) => {
            if (loading) event.preventDefault();
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}

          {loading
            ? "Saving..."
            : isEditing
              ? "Save Changes"
              : "Add Destination"}
        </button>
      </div>
    </form>
  );
}