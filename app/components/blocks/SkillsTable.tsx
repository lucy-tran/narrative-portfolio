import type { ResultSkill, SkillsTableProps } from "~/models/block.server";

export default function SkillsTable({
  properties,
}: {
  properties: SkillsTableProps;
}) {
  function SkillBtn({ skillName, level }: ResultSkill) {
    let borderColor = "border-blue-300 shadow-blue-200";
    switch (level) {
      case "intermediate":
        borderColor = "border-green-300 shadow-green-200";
        break;
      case "advanced":
        borderColor = "border-orange-300 shadow-orange-200";
        break;
      case "expert":
        borderColor = "border-red-300 shadow-red-200";
    }
    return (
      <div
        className={`p-3 bg-white border-2 rounded-xl shadow-md ${borderColor} font-light font-sans text-xl`}
      >
        {skillName}
      </div>
    );
  }

  return (
    <div className="grid items-center grid-cols-1 md:grid-cols-2 w-full px-8 mx-auto sm:px-10 md:px-16 lg:px-24">
      {/* Tech skills */}
      <div className="flex-1 h-full flex flex-col gap-4 border-b-4 md:border-b-0 md:border-r-2 md:border-gray-300">
        <p className="font-serif text-3xl text-center w-full">Tech skills</p>
        <div className="flex flex-wrap w-full gap-4 pb-4 md:pb-0 md:pr-4 ">
          {properties.techSkills.map((skill: ResultSkill, index: number) => {
            if (skill) {
              return (
                <SkillBtn
                  key={index}
                  skillName={skill.skillName}
                  level={skill.level}
                />
              );
            }
          })}
        </div>
      </div>
      {/* Soft skills */}
      <div className="flex-1 h-full flex flex-col gap-4 md:border-l-2 md:border-gray-300">
        <p className="font-serif text-3xl text-center w-full pt-4 md:pt-0">
          Soft skills
        </p>
        <div className="flex flex-wrap w-full gap-4 md:pl-4">
          {properties.softSkills.map((skill: ResultSkill, index: number) => {
            if (skill) {
              return (
                <SkillBtn
                  key={index}
                  skillName={skill.skillName}
                  level={skill.level}
                />
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
