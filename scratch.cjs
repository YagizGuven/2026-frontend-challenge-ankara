const axios = require('axios');
const apiKey = 'ad39735f1449a6dc28d60e0921352665';
const forms = {
  checkins: '261065067494966',
  messages: '261065765723966',
  sightings: '261065244786967',
  notes: '261065509008958',
  tips: '261065875889981'
};

async function run() {
  for (const [name, id] of Object.entries(forms)) {
    try {
        const res = await axios.get(`https://api.jotform.com/form/${id}/submissions?apiKey=${apiKey}&limit=1`);
        console.log(`--- ${name} ---`);
        if (res.data.content && res.data.content.length > 0) {
            console.log(JSON.stringify(res.data.content[0].answers, null, 2));
        } else {
            console.log("No submissions");
        }
    } catch (e) {
        console.error(`Error fetching ${name}:`, e.message);
    }
  }
}
run();
