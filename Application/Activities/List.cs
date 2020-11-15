using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class List
    {
        public class ActivitiesEnvelop
        {
            public List<ActivityDTO> Activities { get; set; }
            public int ActivityCount { get; set; }
        }
        
        public class Query : IRequest<ActivitiesEnvelop> 
        {
            public Query(int? limit, int? offset)
            {
                Limit = limit;
                Offset = offset;
            }

            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        public class Handler : IRequestHandler<Query, ActivitiesEnvelop>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<ActivitiesEnvelop> Handle(Query request, 
                CancellationToken cancellationToken)
            {
                var queryable = _context.Activities.AsQueryable();

                var activities = await queryable
                    .Skip(request.Offset ?? 0)
                    .Take(request.Limit ?? 3).ToListAsync();

                return new ActivitiesEnvelop
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDTO>>(activities),
                    ActivityCount = queryable.Count()
                };     
            }
        }
    }
}
