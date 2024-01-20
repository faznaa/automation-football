import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

async function openAiFun(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
  });
  console.log(completion);

  console.log(completion.choices[0]);
  return completion.choices[0]?.message?.content;
}

const prompt = (teamsData) => `
${teamsData}
 Can you please write a 700 words summary of this match.

Please include the names of the teams, the oval they played at, DO NOT mention the Adelaide football League or the starting time of the game. DO NOT have the result of the game at the top.

When announcing the winner. Just tell us what the final margin was. Don’t give a match summary or descriptive words.

Can you please put the scores for the first quarter, half time, third quarter and final score. The scores need to be written in such as style where it has the final total of each quarter in brackets.

Can you also please put the best players in the summary.

It’s a must the you list the goal scorers at the end of the summary and include their first name and surname. Can you please put the goal kickers summary in the same format as the best players

Its a must that you also list the end of each quarter scores however this can be done line by line

Please do not say if the player was in attack or defence or any position they played.

DO NOT mention when the players kick the goals
 
`;
const fixture = {
  status: "success",
  message: "Data scraped successfully",
  data: {
    date: "02:30 PM, Sunday, 24 Sep 2023",
    place: "Adelaide Oval / Adelaide Oval 1",
    round: "South Australia National Football League (SANFL), 2023",
    playData: "02:30 PM, Sunday, 24 Sep 2023",
    scores: [
      {
        teamName: "Glenelg Football Club",
        points: ["27", "47", "79", "86"],
        secondValues: ["4.3", "7.5", "12.7", "13.8"],
      },
      {
        teamName: "Sturt Football Club",
        points: ["3", "18", "42", "62"],
        secondValues: ["-.3", "2.6", "6.6", "8.14"],
      },
    ],
    playersLength: 4,
    bestPlayers: {
      team_1: [],
      team_2: [
        "William Coomblas",
        " James Battersby",
        " Connor McFadyen",
        " Steven Slimming",
        " Casey Voss",
      ],
      all: [
        "William Coomblas",
        " James Battersby",
        " Connor McFadyen",
        " Steven Slimming",
        " Casey Voss",
      ],
    },
    goalKeepers: {
      team_1: [],
      team_2: [
        {
          index: "7",
          player: "James Mathews",
          goal: "2",
        },
        {
          index: "1",
          player: "Manguru Frederick",
          goal: "1",
        },
        {
          index: "22",
          player: "William Coomblas",
          goal: "1",
        },
        {
          index: "30",
          player: "Oliver Grivell",
          goal: "1",
        },
        {
          index: "31",
          player: "Lachlan Burrows",
          goal: "1",
        },
        {
          index: "34",
          player: "Casey Voss",
          goal: "1",
        },
        {
          index: "44",
          player: "James Richards",
          goal: "1",
        },
      ],
      all: [
        {
          index: "7",
          player: "James Mathews",
          goal: "2",
        },
        {
          index: "1",
          player: "Manguru Frederick",
          goal: "1",
        },
        {
          index: "22",
          player: "William Coomblas",
          goal: "1",
        },
        {
          index: "30",
          player: "Oliver Grivell",
          goal: "1",
        },
        {
          index: "31",
          player: "Lachlan Burrows",
          goal: "1",
        },
        {
          index: "34",
          player: "Casey Voss",
          goal: "1",
        },
        {
          index: "44",
          player: "James Richards",
          goal: "1",
        },
      ],
      text: {
        team_1: [],
      },
    },
  },
};

const generateBlog = async(data) => {
  const teamsData = `
  ${data.scores[0].teamName}
  \t${data.scores[0].points?.join("\n\t")}
    ${data.scores[1].teamName}\t
    \t${data.scores[1].points?.join("\n\t")}

    Date: ${data?.date}
    venue: ${data?.place}

    Best Players

    ${data.scores[0].teamName}
    \t${data.bestPlayers.team_1?.length > 0 ? data.bestPlayers.team_1?.join("\n\t"): "No best players"}
    ${data.scores[1].teamName}
    \t${data.bestPlayers.team_2?.length > 0 ? data.bestPlayers.team_2?.join("\n\t"): "No best players"}

    Player Statistics

    ${data.scores[0].teamName}
    \t${data.goalKeepers.team_1?.map((value) => `${value?.player} - ${value?.goal}`).join("\n\t")}
    ${data.scores[1].teamName}
    \t${data.goalKeepers.team_2?.map((value) => `${value?.player} - ${value?.goal}`).join("\n\t")}
    
  `;
  const finalPrompt = prompt(teamsData);

  const result = await openAiFun(finalPrompt);
  return {
    blog: result,
    date: data.date,
    place: data.place,
    team:data.scores[0].teamName + " vs " + data.scores[1].teamName,
  };

};

const generateBlogFinal = async(input) => {
    const data = await generateBlog(input);
    return data
}
export { generateBlogFinal}