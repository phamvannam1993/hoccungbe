type ChildProfile = {
    name: string;
    avatar: string;
  };
  
  type Props = {
    childProfile: ChildProfile;
    profileDraftName: string;
    setProfileDraftName: (value: string) => void;
    avatarOptions: string[];
    editingProfile: boolean;
    setEditingProfile: (value: boolean) => void;
    onSelectAvatar: (avatar: string) => void;
    onSaveProfile: () => void;
    studyStreakDays: number;
  };
  
  export default function EnglishProfileCard({
    childProfile,
    profileDraftName,
    setProfileDraftName,
    avatarOptions,
    editingProfile,
    setEditingProfile,
    onSelectAvatar,
    onSaveProfile,
    studyStreakDays,
  }: Props) {
    return (
      <div className="mb-6 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl ring-1 ring-emerald-100">
              {childProfile.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Hồ sơ bé</p>
              <p className="text-2xl font-black text-slate-900">{childProfile.name}</p>
              <p className="text-sm text-slate-600">Chuỗi ngày học: {studyStreakDays} ngày</p>
            </div>
          </div>
  
          <div className="flex flex-col gap-3">
            {!editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Chỉnh hồ sơ
              </button>
            ) : (
              <div className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
                <input
                  value={profileDraftName}
                  onChange={(e) => setProfileDraftName(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
                  placeholder="Tên của bé"
                />
  
                <div className="flex flex-wrap gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => onSelectAvatar(avatar)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl ring-1 ${
                        childProfile.avatar === avatar
                          ? 'bg-emerald-50 ring-emerald-300'
                          : 'bg-white ring-slate-200'
                      }`}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
  
                <div className="flex gap-2">
                  <button
                    onClick={onSaveProfile}
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingProfile(false)}
                    className="rounded-full bg-slate-200 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }