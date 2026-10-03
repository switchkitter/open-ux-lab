import { useState } from "react";
import { site } from "../content/site";
import { browserSaysDoNotTrack, loadOptOut, saveOptOut } from "../lib/analytics";
import { hrefFor } from "../lib/route";

/**
 * Privacy notice. Keep it true: if the app starts sending data anywhere new (analytics, a new
 * provider, new fields), update this page and `site.privacyUpdated` in the same change.
 */
export default function PrivacyPage() {
  const [optedOut, setOptedOut] = useState(loadOptOut);
  const browserOptOut = browserSaysDoNotTrack();
  const contact = <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>;
  return (
    <>
      <a className="back" href={hrefFor({ name: "home" })}>
        <span aria-hidden="true">←</span> Home
      </a>
      <article className="lesson privacy">
        <div className="eyebrow">{`Last updated ${site.privacyUpdated}`}</div>
        <h1>Privacy</h1>
        <div className="prose">
          <p>
            {`Open UX Lab is a free learning app run by ${site.owner}, an individual rather than a company. This page explains what data the app handles and why.`}
          </p>
          <p>
            <strong>In short:</strong> you can use the app without giving us any personal information. We keep anonymous
            daily counts of things like lessons completed, which you can switch off. If you create an account to sync your
            progress, we store your email address and your progress, and use them only to sign you in and sync.
          </p>

          <h2>Using the app without an account</h2>
          <ul>
            <li>
              Your progress (XP, level, streak and streak freezes, daily goal, achievements, completed lessons, which exercises you've answered, and your review pile) is
              saved in your browser on your device. It isn't sent to us.
            </li>
            <li>
              The app has no advertising, no tracking cookies and no personal tracking, and doesn't load fonts or scripts from
              other companies. It does keep anonymous usage counts, explained below.
            </li>
            <li>
              The site is hosted on GitHub Pages. Like most web hosts, GitHub records technical details such as your IP
              address when you load the site, to run and protect its service. See the{" "}
              <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">
                GitHub privacy statement
              </a>
              .
            </li>
          </ul>

          <h2>If you create an account</h2>
          <p>We store:</p>
          <ul>
            <li>your email address, to send you sign-in codes</li>
            <li>an account ID that links you to your progress</li>
            <li>your progress, so it can sync between your devices</li>
            <li>sign-in records kept by our database provider for security, such as when you signed in and from which IP address</li>
          </ul>
          <p>
            We use this data only to sign you in and sync your progress, because you asked for that service. We don't send
            marketing emails, and we don't sell or share your data with anyone else.
          </p>

          <h2>Who handles your data</h2>
          <ul>
            <li>
              <strong>Supabase</strong> stores your account and progress, and the anonymous usage counts, on servers in the United States.
            </li>
            <li>
              <strong>Brevo</strong> sends the sign-in code emails, so it handles your email address and those emails. Brevo
              may record whether a sign-in email was opened, to monitor delivery; this is anonymized, and we don't use it.
            </li>
            <li>
              <strong>GitHub</strong> hosts the website.
            </li>
          </ul>
          <p>
            If you live in the UK or the EU, this means your account data is transferred to the United States. These
            providers process it on our behalf under their data processing terms, which include safeguards for international
            transfers.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep your account data until you delete your account. Deleting it removes your email address and synced
            progress from our database straight away. Copies can remain in our providers' backups for a short time before
            they're overwritten.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>
              You can delete your account at any time on the <a href={hrefFor({ name: "account" })}>Account page</a>.
            </li>
            <li>To get a copy of your data, correct it, or ask anything about this page, email {contact}.</li>
            <li>
              If you're unhappy with how we handle your data, you can complain to your data protection authority, such as
              the Information Commissioner's Office in the UK or your national authority in the EU.
            </li>
          </ul>

          <h2>Anonymous usage counts</h2>
          <p>
            To see which lessons help and which confuse people, the app counts a few things: when it's opened, when a lesson
            is opened or completed, when an exercise is answered right or wrong, and when a review is finished. Each count
            stores only the date, what happened, and which lesson or exercise it was, added to a daily total. We don't store
            who did it: no account, device ID, cookie or IP address is kept with these counts. Like any web service,
            Supabase may briefly keep technical logs of requests, including IP addresses, for security.
          </p>
          {browserOptOut ? (
            <p className="notice">Your browser asks sites not to track you, so this browser never sends usage counts.</p>
          ) : (
            <label className="check">
              <input
                type="checkbox"
                checked={optedOut}
                onChange={(e) => {
                  saveOptOut(e.target.checked);
                  setOptedOut(e.target.checked);
                }}
              />
              Don't send anonymous usage counts from this browser
            </label>
          )}
          <p>Counts are also never sent if your browser uses Global Privacy Control or Do Not Track.</p>

          <h2>Data stored in your browser</h2>
          <p>
            The app stores your progress and settings (such as whether sound effects are on, or whether to send usage counts) in your browser, a copy of the app's own files so it works offline, and, if you sign in, the details that keep you signed in. Both are
            needed for the app to work, so there's no cookie banner. Clearing this site's data in your browser removes them.
          </p>

          <h2>Changes to this page</h2>
          <p>
            If what we collect or who handles it changes, we'll update this page and the date at the top. The full history
            of this page is public in the <a href={site.repoUrl}>source code on GitHub</a>.
          </p>
        </div>
      </article>
    </>
  );
}
