import * as webllm from "https://esm.run/@mlc-ai/web-llm";
let engine;
const modelSelector = document.querySelector('select[name=model]');
const runButton = document.querySelector('#run')
const agentsOutput = document.querySelector('#output');
const status = document.querySelector('#status');

// This example was tested with these models
const knownToWorkModels = [
  'SmolLM2-360M-Instruct-q0f16-MLC',
  'SmolLM2-360M-Instruct-q0f32-MLC',
  'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC',
  'Qwen2-0.5B-Instruct-q4f16_1-MLC',
  'Llama-3.2-1B-Instruct-q4f32_1-MLC',
  'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  'DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC'
];
const defaultModel = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

function getModelSizeFactor(model) {
  return Math.floor(model.vram_required_MB / 100) / 10;
}

function enableControls(enabled) {
 [runButton,modelSelector].forEach(e => {
    if(enabled) {
      e.removeAttribute('disabled');
    } else {
      e.setAttribute('disabled', true);
    }
  })
}

function setInfo(text) {
  status.innerText = text;
}

function getAgentsDefinitions() {
  const agents = [];
  setInfo( "Running agents...");
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
  agentsOutput.innerHTML= '';
  enableControls(false);

  const initProgressCallback = (report) => {
    setInfo( report.text);
  };

  try {
    if(!engine) {
      engine = await webllm.CreateMLCEngine(
        modelSelector.value,
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
    }

    const agents = getAgentsDefinitions();
    setInfo( `${agents.length} agent definitions found on the page`);
    var input = document.querySelector('#input').value;
    let displayedInput = input;

    for (var a of agents) {
      setInfo( `Running '${a.name}' agent..`);
      const start = performance.now();

      const messages = [
        { role: "system", content: `${a.backstory} - ${a.role}` },
        { role: "user", content: input }
      ];

      const reply = await engine.chat.completions.create({ messages });
      const duration = performance.now() - start;
      const output = reply?.choices[0]?.message?.content;
      const elapsed = Math.floor(duration / 1000);

      const t = document.querySelector('#output-one').content.cloneNode(true);
      t.querySelector('[class=name]').textContent = a.name;
      t.querySelector('[class=elapsed]').textContent = elapsed;
      t.querySelector('[class=input]').textContent = displayedInput;
      displayedInput = '(the output of the previous agent is used)';
      t.querySelector('[class=output]').textContent = output;
      agentsOutput.append(t);
      input = output;
    }
    setInfo( `Done running  ${agents.length} agents.`);
  } catch(e) {
    setInfo(e);
  }
  enableControls(true);
}

async function main() {
  setInfo( 'Initializing..');

  // Load the list of models
  modelSelector.innerHTML = '';
  for(var model of webllm.prebuiltAppConfig.model_list) {
    const option = document.createElement('option');
    if(!knownToWorkModels.includes(model.model_id)) {
      continue;
    }
    option.textContent = model.model_id;
    option.value = option.textContent;
    option.textContent = `${option.textContent} (size:${getModelSizeFactor(model)})`;
    if(model.model_id === defaultModel) {
      option.selected = true;
    }
    modelSelector.append(option);
  }

  // Setup controls
  modelSelector.addEventListener('change', () => {
    engine = null;
    agentsOutput.innerHTML= '';
    enableControls(true);
  });

  runButton.addEventListener('click', () => runAgents());
  enableControls(true);
  setInfo( 'Initialized.');
}

main()
  .catch(e => { setInfo(e) })
