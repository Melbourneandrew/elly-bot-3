"use client";
import { useEffect, useState } from "react";
import Loader from "../components/Loader.jsx";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    persistentMessage: "",
    knowledgeBase: "",
  });
  const [loading, setLoading] = useState(false);
  //Fetch profiles on load
  useEffect(() => {
    const fetchProfile = async () => {
      // Get profile from server
      const profile = await fetch("/api/knowledge");
      if (profile.status !== 200) return navigate("/login");
      const profileJSON = await profile.json();
      setProfile(profileJSON);
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    if (!profile?.persistentMessage) {
      alert("Please enter a persistent message");
      return;
    }
    console.log(profile);
    setLoading(true);
    let saveProfileRes = await fetch("/api/add-knowledge", {
      method: "POST",
      body: JSON.stringify(profile),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (saveProfileRes.status !== 200)
      return navigate("/login");
    console.log(saveProfileRes);
    setLoading(false);
  };

  return (
    <div className="w-[800px] pt-3 m-auto flex flex-col">
      {/* Header Row (Title, Profile select, save btn) */}
      <div className="flex">
        <h1 className="text-4xl font-bold">Edit Elly</h1>
        <button
          className="btn btn-primary ml-3"
          onClick={() => navigate("/")}
        >
          Back to chat
        </button>
        {/* Save Profile Button */}
        <div className="ml-auto h-[50px]">
          {loading ? (
            <Loader />
          ) : (
            <button
              className="btn btn-primary"
              onClick={saveProfile}
            >
              Save
            </button>
          )}
        </div>
      </div>
      {/* Persistent Message Field */}
      <div className="mt-3">
        <h2 className="text-2xl font-bold">
          Persistant Message
        </h2>
        <p className="text-l">
          This text will appear in every system message for
          every chat
        </p>
        <textarea
          className="textarea textarea-bordered w-full mt-2"
          placeholder="Enter persistent system message"
          onChange={(e) =>
            setProfile({
              ...profile,
              persistentMessage: e.target.value,
            })
          }
          value={profile.persistentMessage}
        ></textarea>
      </div>
      {/* Knowledge Base Field */}
      <div className="mt-3 h-full">
        <h2 className="text-2xl font-bold">Knowledge Base</h2>
        <p className="text-l">
          This text will be refrenced and included in the system
          message on a per-message basis
        </p>
        <textarea
          className="textarea textarea-bordered w-full h-[500px] mt-2 resize-none"
          placeholder="Enter database text"
          onChange={(e) =>
            setProfile({
              ...profile,
              knowledgeBase: e.target.value,
            })
          }
          value={profile.knowledgeBase}
        ></textarea>
      </div>
    </div>
  );
}
