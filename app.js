const $ = (id) => document.getElementById(id);
let category = "None";
const textarea = $("confession");
textarea.addEventListener("input", () => $("count").textContent = textarea.value.length);
document.querySelectorAll(".chip").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach(x => x.classList.remove("selected"));
  btn.classList.add("selected"); category = btn.dataset.category;
}));
$("submit").addEventListener("click", async () => {
  const body = textarea.value.trim();
  const status = $("status");
  if (body.length < 5) { status.textContent = "Please write a little more before sending."; return; }
  if (!$("agree").checked) { status.textContent = "Please confirm the privacy and safety statement."; return; }
  if (!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) { status.textContent = "Website setup is incomplete."; return; }
  const button = $("submit"); button.disabled = true; status.textContent = "Sending...";
  try {
    const response = await fetch(`${window.SUPABASE_URL}/functions/v1/submit-confession`, {
      method: "POST",
      headers: {"Content-Type":"application/json", "apikey":window.SUPABASE_PUBLISHABLE_KEY, "Authorization":`Bearer ${window.SUPABASE_PUBLISHABLE_KEY}`},
      body: JSON.stringify({content:body, category})
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Could not send your confession. Please try again.");
    textarea.value = ""; $("count").textContent = "0"; $("agree").checked = false;
    status.textContent = "Your confession has been sent anonymously. ♥";
  } catch (e) { status.textContent = e.message || "Something went wrong."; }
  finally { button.disabled = false; }
});
