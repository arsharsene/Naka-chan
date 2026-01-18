const shared = require("../shared");

module.exports = {
  name: "setracedetail",
  adminOnly: true,
  async execute(interaction) {
    const date = interaction.options.getString("date");
    const venue = interaction.options.getString("venue");
    const raceNo = interaction.options.getString("raceno");
    const grade = interaction.options.getString("grade");
    const departure = interaction.options.getString("departure");
    const distance = interaction.options.getString("distance");

    if (date) shared.raceDetail.date = date;
    if (venue) shared.raceDetail.venue = venue;
    if (raceNo) shared.raceDetail.raceNo = raceNo;
    if (grade) shared.raceDetail.grade = grade;
    if (departure) shared.raceDetail.departure = departure;
    if (distance) shared.raceDetail.distance = distance;

    shared.saveRaceDetail();

    return interaction.reply({
      content:
        `✅ **Race details updated**\n\n` +
        `📅 ${shared.raceDetail.date}\n` +
        `📍 ${shared.raceDetail.venue} ${shared.raceDetail.raceNo}\n` +
        `🏁 ${shared.raceDetail.grade}\n` +
        `🕒 ${shared.raceDetail.departure}\n` +
        `📏 ${shared.raceDetail.distance}`,
      ephemeral: true,
    });
  },
};
