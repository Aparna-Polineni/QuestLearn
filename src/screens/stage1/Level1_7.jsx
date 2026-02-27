// src/screens/stage1/Level1_7.jsx
import { useState } from 'react';
import {
  DndContext, DragOverlay,
  PointerSensor, useSensor, useSensors,
  useDroppable, useDraggable
} from '@dnd-kit/core';
import { useGame } from '../../context/GameContext';
import Stage1Shell from './Stage1Shell';
import LevelSupportWrapper from '../../components/LevelSupport';
import useUndo from '../../hooks/useUndo';
import './Level1_7.css';

// ── Support content ────────────────────────────────────────────────────────
const SUPPORT = {
  intro: {
    concept: "Professional Project Setup",
    tagline: "A good folder structure is documentation you never have to write.",
    whatYouWillDo:
      "You will build a professional Java Spring Boot and React project structure by dragging file and folder items into the correct locations in a folder tree. Every folder you place has a specific purpose that every Java developer recognises instantly.",
    whyItMatters:
      "A developer who joins your project should know exactly where to find the controllers, services, models, and frontend components without asking. That only happens if your structure follows the convention every Java team uses. Convention over configuration — learn it once, apply it everywhere.",
  },
  hints: [
    "The backend lives under src/main/java. Inside that you need folders for the three layers every Spring Boot app has: controllers (handle HTTP requests), services (business logic), and repositories (database access). Models or entities go in their own folder too.",
    "The frontend is a separate React project. It has its own src folder with components (reusable UI pieces), screens or pages (full page views), hooks (custom React hooks), and context (global state). Keep backend and frontend completely separate at the top level.",
    "Configuration files live in src/main/resources — that is where application.properties lives. The root of the project has pom.xml for Maven dependencies and a README.md. These are not optional — every professional Java project has them.",
  ],
  reveal: {
    concept: "Professional Project Setup",
    whatYouLearned:
      "You just laid out a professional full stack Java project structure that follows Spring Boot conventions. Every folder has a single responsibility. A new developer joining your project will know exactly where to look for every file without asking a single question.",
    realWorldUse:
      "This exact structure — controllers, services, repositories, models — is used by Java teams at every major company. Spring Boot's auto-component-scan works because of this structure. If your UserController is not in a package that Spring Boot scans, it will not be registered as a bean and your API will return 404 for every route.",
    developerSays:
      "I can tell within 30 seconds of opening a project whether the developer knew what they were doing. A clean package structure says everything. It tells me they understand separation of concerns before I read a single line of code.",
  },
};

// ── Project items to place ─────────────────────────────────────────────────
const PROJECT_ITEMS = [
  { id: 'controllers',  label: 'controllers/',          emoji: '🎮', type: 'folder', correctParent: 'java',        desc: 'HTTP request handlers'      },
  { id: 'services',     label: 'services/',             emoji: '⚙️', type: 'folder', correctParent: 'java',        desc: 'Business logic layer'       },
  { id: 'repositories', label: 'repositories/',         emoji: '🗄️', type: 'folder', correctParent: 'java',        desc: 'Database access layer'      },
  { id: 'models',       label: 'models/',               emoji: '📦', type: 'folder', correctParent: 'java',        desc: 'Entity and DTO classes'     },
  { id: 'config',       label: 'config/',               emoji: '🔧', type: 'folder', correctParent: 'java',        desc: 'Spring configuration'       },
  { id: 'appprops',     label: 'application.properties',emoji: '📄', type: 'file',   correctParent: 'resources',   desc: 'App config and DB settings' },
  { id: 'components',   label: 'components/',           emoji: '🧩', type: 'folder', correctParent: 'frontendsrc', desc: 'Reusable UI components'     },
  { id: 'screens',      label: 'screens/',              emoji: '🖥️', type: 'folder', correctParent: 'frontendsrc', desc: 'Full page views'            },
  { id: 'hooks',        label: 'hooks/',                emoji: '🪝', type: 'folder', correctParent: 'frontendsrc', desc: 'Custom React hooks'         },
  { id: 'context',      label: 'context/',              emoji: '🌐', type: 'folder', correctParent: 'frontendsrc', desc: 'Global state context'       },
  { id: 'pomxml',       label: 'pom.xml',               emoji: '📋', type: 'file',   correctParent: 'root',        desc: 'Maven dependencies'         },
  { id: 'readme',       label: 'README.md',             emoji: '📖', type: 'file',   correctParent: 'root',        desc: 'Project documentation'      },
];

// ── Folder tree — every node is now droppable ──────────────────────────────
const FOLDER_TREE = [
  {
    id: 'root', label: 'my-project/', emoji: '📁', level: 0, isFixed: true,
    desc: 'Project root',
    children: [
      {
        id: 'backend', label: 'backend/', emoji: '📁', level: 1,
        desc: 'Java Spring Boot backend',
        children: [
          {
            id: 'src', label: 'src/', emoji: '📁', level: 2,
            desc: 'Source code root',
            children: [
              {
                id: 'main', label: 'main/', emoji: '📁', level: 3,
                desc: 'Main source',
                children: [
                  { id: 'java',      label: 'java/',      emoji: '📁', level: 4, desc: 'Java source packages' },
                  { id: 'resources', label: 'resources/', emoji: '📁', level: 4, desc: 'Config and static files' },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'frontend', label: 'frontend/', emoji: '📁', level: 1,
        desc: 'React frontend',
        children: [
          {
            id: 'frontendsrc', label: 'src/', emoji: '📁', level: 2,
            desc: 'React source',
          },
        ],
      },
    ],
  },
];

// Flatten tree into a list of all folder ids for quick lookup
function getAllFolderIds(nodes) {
  return nodes.flatMap(n => [n.id, ...getAllFolderIds(n.children || [])]);
}
const ALL_FOLDER_IDS = getAllFolderIds(FOLDER_TREE);

// ── Draggable item ─────────────────────────────────────────────────────────
function DraggableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
    data: { item },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`project-item ${item.type === 'file' ? 'item-file' : 'item-folder'}`}
      style={{
        opacity: isDragging ? 0.4 : 1,
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative',
      }}
    >
      <span className="item-emoji">{item.emoji}</span>
      <div>
        <div className="item-label">{item.label}</div>
        <div className="item-desc">{item.desc}</div>
      </div>
    </div>
  );
}

// ── Droppable folder node — ALL folders accept drops ──────────────────────
function FolderNode({ node, placedItems, onRemove }) {
  const { setNodeRef, isOver } = useDroppable({ id: node.id });
  const myItems = placedItems[node.id] || [];

  return (
    <div className="tree-node" style={{ paddingLeft: `${node.level * 18}px` }}>
      {/* Folder label row */}
      <div className={`tree-folder folder-droppable ${isOver ? 'folder-over' : ''} ${myItems.length > 0 ? 'folder-has-items' : ''}`}>
        <span className="tree-emoji">{node.emoji}</span>
        <span className="tree-label">{node.label}</span>
        <span className="tree-desc">{node.desc}</span>
        <span className="tree-drop-hint">drop here</span>
      </div>

      {/* Drop zone — always shown */}
      <div
        ref={setNodeRef}
        className={`tree-dropzone ${isOver ? 'dropzone-active' : ''}`}
        style={{ paddingLeft: `${(node.level + 1) * 18}px` }}
      >
        {myItems.length === 0 && isOver && (
          <div className="tree-drop-preview">Release to place here</div>
        )}
        {myItems.map((item, i) => {
          const isCorrect = item.correctParent === node.id;
          return (
            <div
              key={item.id}
              className={`placed-item ${isCorrect ? 'placed-correct' : 'placed-wrong'}`}
            >
              <span>{item.emoji}</span>
              <span className="placed-item-label">{item.label}</span>
              <span className="placed-item-status">
                {isCorrect ? '✓ correct' : `✗ belongs in ${item.correctParent}/`}
              </span>
              <button
                className="placed-item-remove"
                onClick={() => onRemove(node.id, i)}
              >×</button>
            </div>
          );
        })}
      </div>

      {/* Render children recursively */}
      {node.children?.map(child => (
        <FolderNode
          key={child.id}
          node={child}
          placedItems={placedItems}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

// ── Main Level ─────────────────────────────────────────────────────────────
function Level1_7() {
  const { selectedDomain } = useGame();
  const [placedItems, setPlacedItems, undoControls] = useUndo({});
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const allPlacedIds = Object.values(placedItems).flat().map(i => i.id);
  const unplaced     = PROJECT_ITEMS.filter(i => !allPlacedIds.includes(i.id));

  const correctCount = Object.entries(placedItems).reduce((acc, [folderId, items]) => {
    return acc + items.filter(item => item.correctParent === folderId).length;
  }, 0);

  const canProceed = unplaced.length === 0 && correctCount === PROJECT_ITEMS.length;
  const activeItem = PROJECT_ITEMS.find(i => i.id === activeId);

  function handleDragStart({ active }) { setActiveId(active.id); }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;

    const folderId = over.id;
    if (!ALL_FOLDER_IDS.includes(folderId)) return;

    const item = PROJECT_ITEMS.find(i => i.id === active.id);
    if (!item) return;
    if (allPlacedIds.includes(item.id)) return;

    setPlacedItems(prev => ({
      ...prev,
      [folderId]: [...(prev[folderId] || []), item],
    }));
  }

  function removeItem(folderId, index) {
    setPlacedItems(prev => ({
      ...prev,
      [folderId]: prev[folderId].filter((_, i) => i !== index),
    }));
  }

  return (
    <Stage1Shell levelId={7} canProceed={canProceed} conceptReveal={SUPPORT.reveal} undoControls={undoControls}>
      <LevelSupportWrapper
        conceptIntro={SUPPORT.intro}
        hints={SUPPORT.hints}
        levelComplete={canProceed}
      >
        <div className="l17-container">

          {/* Brief */}
          <div className="l17-brief">
            <div className="l17-brief-tag">// Mission Brief</div>
            <h2 className="l17-brief-title">
              Set up the project structure for your{' '}
              <span style={{ color: selectedDomain?.color }}>{selectedDomain?.name}</span>.
            </h2>
            <p className="l17-brief-text">
              Drag each file and folder into any location in the project tree.
              Correct placements show <span style={{ color: '#4ade80' }}>✓ correct</span>.
              Wrong placements show <span style={{ color: '#ef4444' }}>✗</span> and tell you where it actually belongs.
            </p>
            <div className="l17-score">
              <span className="l17-score-label">
                {correctCount} of {PROJECT_ITEMS.length} items correctly placed
              </span>
              <div className="l17-score-bar">
                <div
                  className="l17-score-fill"
                  style={{ width: `${(correctCount / PROJECT_ITEMS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="l17-workspace">

              {/* Folder tree */}
              <div className="l17-tree">
                <div className="l17-tree-label">Project Structure — every folder accepts drops</div>
                {FOLDER_TREE.map(node => (
                  <FolderNode
                    key={node.id}
                    node={node}
                    placedItems={placedItems}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              {/* Items panel */}
              {unplaced.length > 0 && (
                <div className="l17-panel">
                  <div className="l17-panel-label">Items to Place</div>
                  <div className="l17-panel-sub">Drag into any folder</div>
                  <div className="l17-panel-list">
                    {unplaced.map(item => (
                      <DraggableItem key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}

            </div>

            <DragOverlay>
              {activeItem && (
                <div className="project-item item-overlay">
                  <span className="item-emoji">{activeItem.emoji}</span>
                  <div>
                    <div className="item-label">{activeItem.label}</div>
                  </div>
                </div>
              )}
            </DragOverlay>

          </DndContext>

          {/* Insight */}
          <div className="l17-insight">
            <div className="l17-insight-label">💡 Why structure matters</div>
            <p>
              Spring Boot's <code>@ComponentScan</code> automatically finds your <code>@Controller</code>,{' '}
              <code>@Service</code>, and <code>@Repository</code> classes — but only if they are in the right package.
              Put a controller in the wrong folder and Spring Boot will not register it.
              Your API will return <code>404</code> for every route. Structure is not aesthetic — it is functional.
            </p>
          </div>

          {canProceed && (
            <div className="l17-success">
              ✓ Project structure complete. Every file is in the right place. Your team can navigate this project without a map.
            </div>
          )}

        </div>
      </LevelSupportWrapper>
    </Stage1Shell>
  );
}

export default Level1_7;