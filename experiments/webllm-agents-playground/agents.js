import * as webllm from "https://esm.run/@mlc-ai/web-llm";
let engine;

function setInfo(id, text, cssClass) {
  const e = document.getElementById(id);
  if (e == null) {
    throw Error("Cannot find label " + id);
  }
  if (cssClass) {
    e.classList.add(cssClass);
  }
  e.innerText = text;
}

function getAgentsDefinitions() {
  const agents = [];
  setInfo('status', "Running agents...");
  document.querySelectorAll('agent-definition').forEach(a => {
    const agent = {};
    agent.name = a.querySelector('[class=name]')?.value.trim();
    agent.goal = a.querySelector('[class=goal]')?.value.trim();
    agent.backstory = a.querySelector('[class=backstory]')?.value.trim();
    agents.push(agent);
  });
  return agents;
}

async function runAgents() {
  const run = document.querySelector('#run')
  run.setAttribute('disabled', 'true');
  const agents = getAgentsDefinitions();
  setInfo('status', `${agents.length} agent definitions found on the page`);
  var input = document.querySelector('#input').value;
  const out = document.querySelector('#output');
  out.innerHTML = '';
  let displayedInput = input;

  for (var a of agents) {
    setInfo('status', `Running '${a.name}' agent..`);
    const start = performance.now();

    const messages = [
      { role: "system", content: `${a.backstory} - ${a.role}` },
      { role: "user", content: input }
    ];

    console.log('running agent', a, 'input', messages);
    const reply = await engine.chat.completions.create({ messages });
    const duration = performance.now() - start;
    const output = reply?.choices[0]?.message?.content;
    console.log('output', output);
    const elapsed = Math.floor(duration / 1000);
    console.log(`Agent '${a.name}' took ${elapsed} seconds`);

    const t = document.querySelector('#output-one').content.cloneNode(true);
    t.querySelector('[class=name]').textContent = a.name;
    t.querySelector('[class=elapsed]').textContent = elapsed;
    t.querySelector('[class=input]').textContent = displayedInput;
    displayedInput = '(the output of the previous agent is used)';
    t.querySelector('[class=output]').textContent = output;
    out.append(t);
    input = output;
  }
  setInfo('status', `Done running  ${agents.length} agents.`);
  run.removeAttribute('disabled');
}

async function main() {
  setInfo('status', 'Initializing..');
  const initProgressCallback = (report) => {
    setInfo('status', report.text);
  };
  const selectedModel = 'Llama-3.2-1B-Instruct-q0f16-MLC';
  setInfo('model', selectedModel);
  engine = await webllm.CreateMLCEngine(
    selectedModel,
    {
      initProgressCallback: initProgressCallback,
      logLevel: "INFO",
    },
    {
      context_window_size: 4096,
      //sliding_window_size: 1024,
      attention_sink_size: 4,
    },
  );

  document.querySelector('#run').addEventListener('click', () => runAgents());

  runAgents();
}

main()
  .catch(e => { setInfo('status', e, 'error'); })
